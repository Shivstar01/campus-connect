import { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from '../SocketContext';

function emitWithAck(socket, event, payload, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Socket event "${event}" timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    socket.emit(event, payload, (ack) => {
      clearTimeout(timer);
      if (!ack) return reject(new Error(`No acknowledgement for "${event}"`));
      if (!ack.ok) return reject(new Error(ack.error || `"${event}" failed on server`));
      resolve(ack);
    });
  });
}

export function usePartyCart() {
  const { socket, connected } = useSocket();

  const [cart, setCart]           = useState([]);
  const [members, setMembers]     = useState(0);
  const [partyId, setPartyId]     = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);

  const partyIdRef = useRef(null);

  const handleCartUpdated = useCallback((event) => {
    setCart(event.cart ?? []);
  }, []);

  const handleMemberJoined = useCallback(({ memberCount }) => {
    setMembers(memberCount);
  }, []);

  const handleMemberLeft = useCallback(({ memberCount }) => {
    setMembers(memberCount);
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('cart_updated',  handleCartUpdated);
    socket.on('member_joined', handleMemberJoined);
    socket.on('member_left',   handleMemberLeft);
    return () => {
      socket.off('cart_updated',  handleCartUpdated);
      socket.off('member_joined', handleMemberJoined);
      socket.off('member_left',   handleMemberLeft);
    };
  }, [socket, handleCartUpdated, handleMemberJoined, handleMemberLeft]);

  useEffect(() => {
    if (!socket) return;
    const handleReconnect = () => {
      const savedPartyId = partyIdRef.current;
      if (savedPartyId) {
        joinParty(savedPartyId).catch((err) =>
          console.error('[usePartyCart] Re-join after reconnect failed:', err.message)
        );
      }
    };
    socket.on('reconnect', handleReconnect);
    return () => socket.off('reconnect', handleReconnect);
  }, [socket]);

  const joinParty = useCallback(async (id) => {
    if (!socket || !connected) throw new Error('Socket is not connected. Please wait and try again.');
    setIsLoading(true);
    setError(null);
    try {
      const ack = await emitWithAck(socket, 'join_party', id);
      setCart(ack.cart ?? []);
      setMembers(ack.memberCount ?? 1);
      setPartyId(id);
      partyIdRef.current = id;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [socket, connected]);

  const leaveParty = useCallback(async () => {
    if (!socket) return;
    try {
      await emitWithAck(socket, 'leave_party', null);
    } catch (err) {
      console.warn('[usePartyCart] leaveParty ack error:', err.message);
    } finally {
      setCart([]);
      setMembers(0);
      setPartyId(null);
      partyIdRef.current = null;
    }
  }, [socket]);

  const addToCart = useCallback(async (item, quantity = 1) => {
    if (!socket || !connected) throw new Error('Not connected to Party Mode.');
    if (!partyIdRef.current) throw new Error('Not in a party. Call joinParty first.');
    const payload = {
      itemId:   item._id,
      name:     item.name,
      price:    item.price,
      quantity,
      category: item.category ?? '',
    };
    setError(null);
    try {
      await emitWithAck(socket, 'add_to_cart', payload);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [socket, connected]);

  const removeFromCart = useCallback(async (itemId) => {
    if (!socket || !connected) throw new Error('Not connected.');
    setError(null);
    try {
      await emitWithAck(socket, 'remove_from_cart', itemId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [socket, connected]);

  const updateQuantity = useCallback(async (itemId, delta) => {
    if (!socket || !connected) throw new Error('Not connected.');
    if (delta !== 1 && delta !== -1) throw new Error('delta must be 1 or -1.');
    setError(null);
    try {
      await emitWithAck(socket, 'update_quantity', { itemId, delta });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [socket, connected]);

  const clearCart = useCallback(async () => {
    if (!socket || !connected) throw new Error('Not connected.');
    setError(null);
    try {
      await emitWithAck(socket, 'clear_cart', null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [socket, connected]);

  return {
    cart,
    members,
    partyId,
    isInParty:   partyId !== null,
    memberCount: members,
    isLoading,
    error,
    joinParty,
    leaveParty,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}