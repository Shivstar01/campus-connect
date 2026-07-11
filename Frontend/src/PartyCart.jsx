/**
 * PartyCart.jsx — CampusConnect Party Mode UI
 *
 * Drop this component wherever you want to expose Party Mode in the app.
 * It is self-contained: reads from usePartyCart() and renders the full
 * join / active-party experience.
 *
 * Styling: Tailwind v4 utility classes consistent with the existing app.
 */

import { useState, useRef } from 'react';
import { usePartyCart } from './hooks/usePartyCart';
import { useSocket } from './SocketContext';

// ── Small UI helpers ───────────────────────────────────────────────────────

function StatusDot({ connected }) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
        connected ? 'bg-green-500 animate-pulse' : 'bg-red-400'
      }`}
    />
  );
}

function CartItemRow({ item, onIncrement, onDecrement, onRemove }) {
  return (
    <li className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-800 truncate">{item.name}</p>
        <p className="text-xs text-zinc-500">₹{item.price.toFixed(2)} each</p>
      </div>
      <div className="flex items-center gap-1.5 ml-3">
        <button
          onClick={() => onDecrement(item.itemId)}
          className="w-6 h-6 rounded-full bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-sm font-bold flex items-center justify-center transition-colors"
          aria-label="Decrease quantity"
        >−</button>
        <span className="w-5 text-center text-sm font-semibold text-zinc-800">
          {item.quantity}
        </span>
        <button
          onClick={() => onIncrement(item.itemId)}
          className="w-6 h-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold flex items-center justify-center transition-colors"
          aria-label="Increase quantity"
        >+</button>
        <button
          onClick={() => onRemove(item.itemId)}
          className="ml-1 text-zinc-400 hover:text-red-500 transition-colors text-xs"
          aria-label="Remove item"
        >✕</button>
      </div>
    </li>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function PartyCart() {
  const { connected } = useSocket();

  const {
    cart, partyId, isInParty, memberCount, isLoading, error,
    joinParty, leaveParty, removeFromCart, updateQuantity, clearCart,
  } = usePartyCart();

  const [inputId, setInputId]   = useState('');
  const [joinError, setJoinError] = useState('');
  const inputRef = useRef(null);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // ── Generate a random party ID for "Create Party" ──────────────────────
  const generatePartyId = () => {
    const id = Math.random().toString(36).slice(2, 8).toUpperCase();
    setInputId(id);
    inputRef.current?.focus();
  };

  // ── Join / create party ────────────────────────────────────────────────
  const handleJoin = async () => {
    const id = inputId.trim();
    if (!id) {
      setJoinError('Enter a Party ID or generate one.');
      return;
    }
    setJoinError('');
    try {
      await joinParty(id);
    } catch (err) {
      setJoinError(err.message);
    }
  };

  // ── Quantity helpers ───────────────────────────────────────────────────
  const handleIncrement = (itemId) => updateQuantity(itemId, 1).catch(console.error);
  const handleDecrement = (itemId) => updateQuantity(itemId, -1).catch(console.error);
  const handleRemove    = (itemId) => removeFromCart(itemId).catch(console.error);
  const handleClear     = ()       => clearCart().catch(console.error);

  // ── Render: not connected ──────────────────────────────────────────────
  
  if (!connected) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm text-center">
        <p className="text-sm text-zinc-500">
          <StatusDot connected={false} />
          Connecting to Party Mode…
        </p>
      </div>
    );
  }

  // ── Render: join screen ────────────────────────────────────────────────
  if (!isInParty) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4 max-w-sm mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎉</span>
          <div>
            <h2 className="text-base font-semibold text-zinc-800">Party Mode</h2>
            <p className="text-xs text-zinc-500">Share a cart with your squad in real-time</p>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="party-id" className="text-xs font-medium text-zinc-600">
            Party ID
          </label>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              id="party-id"
              type="text"
              value={inputId}
              onChange={(e) => setInputId(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              placeholder="e.g. ABC123"
              maxLength={36}
              className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={generatePartyId}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-600 hover:bg-zinc-50 transition-colors"
              title="Generate random Party ID"
            >
              🎲 New
            </button>
          </div>
          {joinError && <p className="text-xs text-red-500">{joinError}</p>}
          {error     && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <button
          onClick={handleJoin}
          disabled={isLoading}
          className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 text-sm transition-colors"
        >
          {isLoading ? 'Joining…' : 'Join / Create Party'}
        </button>

        <p className="text-center text-xs text-zinc-400">
          <StatusDot connected={connected} />
          Live sync active
        </p>
      </div>
    );
  }

  // ── Render: active party ───────────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-orange-50 border-b border-orange-100">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎉</span>
          <div>
            <p className="text-xs text-zinc-500 font-medium">Party ID</p>
            <p className="text-sm font-bold text-zinc-800 tracking-widest font-mono">{partyId}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500">
            <StatusDot connected={connected} />
            {memberCount} member{memberCount !== 1 ? 's' : ''}
          </p>
          <button
            onClick={leaveParty}
            className="text-xs text-red-400 hover:text-red-600 transition-colors mt-0.5"
          >
            Leave party
          </button>
        </div>
      </div>

      {/* Cart items */}
      <div className="px-5 py-3 min-h-[120px]">
        {cart.length === 0 ? (
          <p className="text-center text-sm text-zinc-400 py-8">
            Cart is empty — add items from the menu!
          </p>
        ) : (
          <ul>
            {cart.map((item) => (
              <CartItemRow
                key={item.itemId}
                item={item}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onRemove={handleRemove}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      {cart.length > 0 && (
        <div className="px-5 py-3 border-t border-zinc-100 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-zinc-600">Total</span>
            <span className="text-base font-bold text-zinc-800">₹{total.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleClear}
              className="flex-1 rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50 text-sm py-2 transition-colors"
            >
              Clear all
            </button>
            <button
              className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm py-2 transition-colors"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Error toast */}
      {error && (
        <div className="px-5 pb-3">
          <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        </div>
      )}
    </div>
  );
}