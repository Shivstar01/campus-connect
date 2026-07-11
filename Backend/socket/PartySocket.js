'use strict';

const jwt = require('jsonwebtoken');
const partyRooms = new Map();

function sanitizeString(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[<>"'`]/g, '')          
    .replace(/[$]/g, '')              
    .replace(/\.\./g, '')             
    .trim()
    .slice(0, 512);                   
}


function sanitizeCartItem(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('Payload must be a plain object.');
  }

  const { itemId, name, price, quantity, category } = raw;

  // Type + presence checks
  if (typeof itemId !== 'string' || itemId.trim() === '') {
    throw new Error('itemId must be a non-empty string.');
  }
  if (typeof name !== 'string' || name.trim() === '') {
    throw new Error('name must be a non-empty string.');
  }
  if (typeof price !== 'number' || !isFinite(price) || price < 0) {
    throw new Error('price must be a non-negative finite number.');
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    throw new Error('quantity must be an integer between 1 and 99.');
  }

  return {
    itemId:   sanitizeString(itemId),
    name:     sanitizeString(name),
    price:    Math.round(price * 100) / 100,  
    quantity: quantity,
    category: sanitizeString(typeof category === 'string' ? category : ''),
  };
}


 
function sanitizePartyId(raw) {
  if (typeof raw !== 'string') throw new Error('partyId must be a string.');
  const cleaned = raw.trim();
  if (!/^[a-zA-Z0-9-]{4,36}$/.test(cleaned)) {
    throw new Error('partyId must be 4–36 alphanumeric characters (hyphens allowed).');
  }
  return cleaned;
}



function getOrCreateRoom(partyId) {
  if (!partyRooms.has(partyId)) {
    partyRooms.set(partyId, { cart: [], members: new Map() });
  }
  return partyRooms.get(partyId);
}


function evictSocket(socketId) {
  for (const [partyId, room] of partyRooms.entries()) {
    if (room.members.has(socketId)) {
      room.members.delete(socketId);
      if (room.members.size === 0) {
        partyRooms.delete(partyId);
        console.log(`[PartySocket] Room "${partyId}" GC'd — no members remaining.`);
      }
      return partyId; 
    }
  }
  return null;
}




function initPartySocket(io) {
 
  io.use((socket, next) => {
    try {
      
      const token = socket.handshake.auth?.token;

      if (!token || typeof token !== 'string') {
        return next(new Error('AUTH_MISSING: No token provided.'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      socket.user = {
        userId: String(decoded.userId),
        role:   decoded.role || 'student',
      };

      next();
    } catch (err) {
      
      next(new Error('AUTH_INVALID: Token verification failed.'));
    }
  });

  
  io.on('connection', (socket) => {
    const { userId, role } = socket.user;
    console.log(`[PartySocket] ✓ Connected: userId=${userId} socketId=${socket.id}`);

    
    socket.on('join_party', (rawPartyId, ack) => {
      try {
        const partyId = sanitizePartyId(rawPartyId);

        
        const previousPartyId = socket.currentPartyId;
        if (previousPartyId && previousPartyId !== partyId) {
          socket.leave(previousPartyId);
          evictSocket(socket.id); 
          console.log(`[PartySocket] userId=${userId} left party "${previousPartyId}"`);
        }

        const room = getOrCreateRoom(partyId);
        room.members.set(socket.id, { userId, joinedAt: Date.now() });
        socket.currentPartyId = partyId;
        socket.join(partyId);

        console.log(`[PartySocket] userId=${userId} joined party "${partyId}" (${room.members.size} members)`);

        // Send current cart snapshot to the joining user only
        if (typeof ack === 'function') {
          ack({ ok: true, cart: room.cart, memberCount: room.members.size });
        }

        // Notify others in the room
        socket.to(partyId).emit('member_joined', {
          userId,
          memberCount: room.members.size,
        });

      } catch (err) {
        console.warn(`[PartySocket] join_party error for userId=${userId}:`, err.message);
        if (typeof ack === 'function') ack({ ok: false, error: err.message });
      }
    });

    // ── add_to_cart ───────────────────────────────────────────────────────
    socket.on('add_to_cart', (rawPayload, ack) => {
      try {
        const partyId = socket.currentPartyId;
        if (!partyId) throw new Error('Not in a party. Call join_party first.');

        const room = partyRooms.get(partyId);
        if (!room) throw new Error('Party room not found.');

        // ── SANITISE before touching any state ──────────────────────────
        const item = sanitizeCartItem(rawPayload);

        // Merge into server-side cart (source of truth)
        const existing = room.cart.find((c) => c.itemId === item.itemId);
        if (existing) {
          existing.quantity = Math.min(existing.quantity + item.quantity, 99);
        } else {
          room.cart.push(item);
        }

        const event = {
          type:      'add',
          item,
          addedBy:   userId,
          cart:      room.cart,           // full cart so clients can reconcile
          timestamp: Date.now(),
        };

        // Broadcast to EVERYONE in the room (including sender for confirmation)
        io.to(partyId).emit('cart_updated', event);
        if (typeof ack === 'function') ack({ ok: true });

      } catch (err) {
        console.warn(`[PartySocket] add_to_cart error for userId=${userId}:`, err.message);
        if (typeof ack === 'function') ack({ ok: false, error: err.message });
      }
    });

    // ── remove_from_cart ──────────────────────────────────────────────────
    socket.on('remove_from_cart', (rawItemId, ack) => {
      try {
        const partyId = socket.currentPartyId;
        if (!partyId) throw new Error('Not in a party.');

        const room = partyRooms.get(partyId);
        if (!room) throw new Error('Party room not found.');

        const itemId = sanitizeString(rawItemId);
        if (!itemId) throw new Error('itemId is required.');

        const before = room.cart.length;
        room.cart = room.cart.filter((c) => c.itemId !== itemId);
        if (room.cart.length === before) throw new Error('Item not found in cart.');

        const event = {
          type:      'remove',
          itemId,
          removedBy: userId,
          cart:      room.cart,
          timestamp: Date.now(),
        };

        io.to(partyId).emit('cart_updated', event);
        if (typeof ack === 'function') ack({ ok: true });

      } catch (err) {
        console.warn(`[PartySocket] remove_from_cart error for userId=${userId}:`, err.message);
        if (typeof ack === 'function') ack({ ok: false, error: err.message });
      }
    });

    // ── update_quantity ───────────────────────────────────────────────────
    socket.on('update_quantity', ({ itemId: rawItemId, delta: rawDelta } = {}, ack) => {
      try {
        const partyId = socket.currentPartyId;
        if (!partyId) throw new Error('Not in a party.');

        const room = partyRooms.get(partyId);
        if (!room) throw new Error('Party room not found.');

        const itemId = sanitizeString(rawItemId);
        if (!itemId) throw new Error('itemId is required.');

        const delta = rawDelta === 1 ? 1 : rawDelta === -1 ? -1 : null;
        if (delta === null) throw new Error('delta must be exactly 1 or -1.');

        const item = room.cart.find((c) => c.itemId === itemId);
        if (!item) throw new Error('Item not found in cart.');

        item.quantity = Math.min(Math.max(item.quantity + delta, 0), 99);
        if (item.quantity === 0) {
          room.cart = room.cart.filter((c) => c.itemId !== itemId);
        }

        const event = {
          type:      'update',
          itemId,
          delta,
          updatedBy: userId,
          cart:      room.cart,
          timestamp: Date.now(),
        };

        io.to(partyId).emit('cart_updated', event);
        if (typeof ack === 'function') ack({ ok: true });

      } catch (err) {
        console.warn(`[PartySocket] update_quantity error for userId=${userId}:`, err.message);
        if (typeof ack === 'function') ack({ ok: false, error: err.message });
      }
    });

    // ── clear_cart ────────────────────────────────────────────────────────
    socket.on('clear_cart', (_, ack) => {
      try {
        const partyId = socket.currentPartyId;
        if (!partyId) throw new Error('Not in a party.');

        const room = partyRooms.get(partyId);
        if (!room) throw new Error('Party room not found.');

        room.cart = [];

        io.to(partyId).emit('cart_updated', {
          type:      'clear',
          clearedBy: userId,
          cart:      [],
          timestamp: Date.now(),
        });
        if (typeof ack === 'function') ack({ ok: true });

      } catch (err) {
        if (typeof ack === 'function') ack({ ok: false, error: err.message });
      }
    });

    // ── leave_party ───────────────────────────────────────────────────────
    socket.on('leave_party', (_, ack) => {
      const partyId = socket.currentPartyId;
      if (partyId) {
        socket.leave(partyId);
        const vacatedPartyId = evictSocket(socket.id);
        if (vacatedPartyId) {
          const remaining = partyRooms.get(vacatedPartyId)?.members.size ?? 0;
          socket.to(vacatedPartyId).emit('member_left', { userId, memberCount: remaining });
        }
        socket.currentPartyId = null;
      }
      if (typeof ack === 'function') ack({ ok: true });
    });

    // ── disconnect ────────────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      console.log(`[PartySocket] Disconnect: userId=${userId} socketId=${socket.id} reason=${reason}`);
      const vacatedPartyId = evictSocket(socket.id);
      if (vacatedPartyId) {
        const remaining = partyRooms.get(vacatedPartyId)?.members.size ?? 0;
        io.to(vacatedPartyId).emit('member_left', { userId, memberCount: remaining });
      }
    });

    // ── error ─────────────────────────────────────────────────────────────
    socket.on('error', (err) => {
      console.error(`[PartySocket] Socket error for userId=${userId}:`, err);
    });
  });
}


module.exports = { initPartySocket };
