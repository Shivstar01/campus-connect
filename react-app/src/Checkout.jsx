// react-app/src/Checkout.jsx
// ─────────────────────────────────────────────────────────────
// Polished mock payment — realistic card UI, no real gateway.
// Looks and feels like a real payment flow for demos/portfolio.
// ─────────────────────────────────────────────────────────────

import { useState, useContext, useCallback } from 'react';
import { CartContext } from './CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, User, CheckCircle, Lock, CreditCard, Calendar, Shield } from 'lucide-react';
import { toast, Toaster } from 'sonner';

// ── Tiny helpers ─────────────────────────────────────────────
const formatCardNumber = (val) =>
  val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

const formatExpiry = (val) => {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

const getCardType = (num) => {
  const n = num.replace(/\s/g, '');
  if (/^4/.test(n))          return 'VISA';
  if (/^5[1-5]/.test(n))     return 'MC';
  if (/^3[47]/.test(n))      return 'AMEX';
  if (/^6/.test(n))          return 'RUPAY';
  return null;
};

const CardBadge = ({ type }) => {
  if (!type) return null;
  const labels = { VISA: 'VISA', MC: 'MC', AMEX: 'AMEX', RUPAY: 'RuPay' };
  const colors  = { VISA: '#1a1f71', MC: '#eb001b', AMEX: '#007bc1', RUPAY: '#097969' };
  return (
    <span style={{ color: colors[type] }}
      className="text-[11px] font-black tracking-widest absolute right-3 top-1/2 -translate-y-1/2 select-none">
      {labels[type]}
    </span>
  );
};

const Checkout = () => {
  const { cart, clearCart, addOrder } = useContext(CartContext);
  const [name,    setName]    = useState('');
  const [room,    setRoom]    = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step,    setStep]    = useState('details'); // 'details' | 'payment'

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName,   setCardName]   = useState('');
  const [expiry,     setExpiry]     = useState('');
  const [cvv,        setCvv]        = useState('');
  const [cvvFocused, setCvvFocused] = useState(false);

  const navigate = useNavigate();
  const total    = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cardType = getCardType(cardNumber);

  // ── Proceed to payment step ───────────────────────────────
  const handleProceed = () => {
    if (!name.trim() || !room.trim()) {
      toast.error('Missing details', {
        description: 'Please enter your name and room number.',
      });
      return;
    }
    setStep('payment');
  };

  // ── Mock payment handler ──────────────────────────────────
  const handleMockPayment = useCallback(async () => {
    if (!cardNumber || !cardName || !expiry || !cvv) {
      toast.error('Incomplete card details', {
        description: 'Please fill in all card fields.',
      });
      return;
    }

    setLoading(true);

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 2200));

    try {
      const newOrder = {
        customerName: name,
        roomNumber:   room,
        foodItems:    cart,
        orderTotal:   total,
        paymentId:    `mock_${Date.now()}`,
      };

      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(newOrder),
      });
      const data = await res.json();

      if (data.success) {
        addOrder(newOrder);
        toast.success('Payment Successful! 🎉', {
          description: `₹${total} paid. Your order is confirmed!`,
        });
        setSuccess(true);
        setTimeout(() => { clearCart(); navigate('/'); }, 2500);
      } else {
        throw new Error('Order save failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong', {
        description: 'Could not save your order. Is your backend running?',
      });
    }

    setLoading(false);
  }, [cardNumber, cardName, expiry, cvv, name, room, cart, total, clearCart, addOrder, navigate]);

  // ── Empty cart ────────────────────────────────────────────
  if (cart.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center font-sans p-4">
        <Toaster richColors position="top-center" />
        <p className="text-4xl mb-4">🛒</p>
        <h2 className="text-[20px] font-black text-slate-700 mb-2">Cart is empty</h2>
        <button onClick={() => navigate('/menu')}
          className="mt-4 bg-orange-500 text-white font-black px-8 py-3 rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-colors">
          Go to Menu
        </button>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center font-sans p-4">
        <Toaster richColors position="top-center" />
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }} className="text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-500" strokeWidth={2} />
          </div>
          <h2 className="text-[24px] font-black text-slate-800 mb-2">Payment Successful! 🎉</h2>
          <p className="text-slate-500 text-[14px]">Your order is confirmed and on its way.</p>
        </motion.div>
      </div>
    );
  }

  // ── Main UI ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans pb-10">
      <Toaster richColors position="top-center" />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100"
        style={{ WebkitBackdropFilter: 'blur(20px)' }}>
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => step === 'payment' ? setStep('details') : navigate('/cart')}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
            <ArrowLeft size={15} className="text-slate-600" strokeWidth={2.5} />
          </button>
          <h1 className="text-[16px] font-black text-slate-800">
            {step === 'details' ? 'Checkout' : 'Secure Payment'}
          </h1>
          {step === 'payment' && (
            <div className="ml-auto flex items-center gap-1 text-green-600">
              <Lock size={12} strokeWidth={2.5} />
              <span className="text-[11px] font-bold">SSL Secured</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="flex items-center gap-2 mb-5">
          {['details', 'payment'].map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black transition-all
                ${step === s || (s === 'details' && step === 'payment')
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-200 text-slate-400'}`}>
                {s === 'details' && step === 'payment' ? '✓' : i + 1}
              </div>
              <span className={`text-[12px] font-bold transition-all
                ${step === s ? 'text-orange-500' : 'text-slate-400'}`}>
                {s === 'details' ? 'Details' : 'Payment'}
              </span>
              {i === 0 && <div className="flex-1 h-px bg-slate-200 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 space-y-4">
        <AnimatePresence mode="wait">

          {/* ── STEP 1: Details ── */}
          {step === 'details' && (
            <motion.div key="details"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              className="space-y-4">

              {/* Order Summary */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Order Summary</p>
                <div className="space-y-2">
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-[13px]">
                      <span className="text-slate-600">{item.name} <span className="text-slate-400">×{item.quantity}</span></span>
                      <span className="font-bold text-slate-700">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t border-dashed border-slate-200 pt-3 mt-3 flex justify-between">
                    <span className="text-[14px] font-black text-slate-800">Total</span>
                    <span className="text-[20px] font-black text-orange-500">₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Delivery Details</p>
                <div className="mb-4">
                  <label className="flex items-center gap-1.5 text-[12px] font-black text-slate-600 mb-2 uppercase tracking-wide">
                    <User size={12} strokeWidth={2.5} /> Your Name
                  </label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bhumika Sharma"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-[12px] font-black text-slate-600 mb-2 uppercase tracking-wide">
                    <MapPin size={12} strokeWidth={2.5} /> Room / Hostel Block
                  </label>
                  <input type="text" value={room} onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. Block B, Room 304"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button onClick={handleProceed}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white text-[16px] font-black py-5 rounded-2xl shadow-lg shadow-orange-200 transition-all">
                  Continue to Payment →
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ── STEP 2: Payment ── */}
          {step === 'payment' && (
            <motion.div key="payment"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}
              className="space-y-4">

              {/* Visual Card Preview */}
              <motion.div
                className="relative h-44 rounded-2xl overflow-hidden p-6 flex flex-col justify-between select-none"
                style={{
                  background: cvvFocused
                    ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                    : 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)',
                  boxShadow: '0 8px 32px rgba(249,115,22,0.35)',
                  transition: 'background 0.4s ease',
                }}>
                {/* Shimmer circles */}
                <div className="absolute top-[-20px] right-[-20px] w-40 h-40 rounded-full opacity-10 bg-white" />
                <div className="absolute bottom-[-30px] left-[-10px] w-32 h-32 rounded-full opacity-10 bg-white" />

                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">CampusConnect Pay</p>
                  </div>
                  {cardType && (
                    <span className="text-white font-black text-[13px] tracking-widest">{cardType}</span>
                  )}
                </div>

                {cvvFocused ? (
                  <div className="relative z-10">
                    <div className="w-full h-8 bg-black/40 rounded-lg flex items-center justify-end px-4">
                      <span className="text-white font-black tracking-widest text-[14px]">
                        {cvv.replace(/./g, '●') || '●●●'}
                      </span>
                    </div>
                    <p className="text-white/60 text-[10px] mt-1 text-right">CVV</p>
                  </div>
                ) : (
                  <div className="relative z-10">
                    <p className="text-white font-black text-[18px] tracking-[0.2em] mb-3">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-white/50 text-[9px] uppercase tracking-widest">Card Holder</p>
                        <p className="text-white font-bold text-[12px] uppercase tracking-wide">
                          {cardName || 'YOUR NAME'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/50 text-[9px] uppercase tracking-widest">Expires</p>
                        <p className="text-white font-bold text-[12px]">{expiry || 'MM/YY'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Card Form */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 space-y-4"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Card Details</p>

                {/* Card Number */}
                <div>
                  <label className="flex items-center gap-1.5 text-[12px] font-black text-slate-600 mb-2 uppercase tracking-wide">
                    <CreditCard size={12} strokeWidth={2.5} /> Card Number
                  </label>
                  <div className="relative">
                    <input type="text" inputMode="numeric" value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition pr-16" />
                    <CardBadge type={cardType} />
                  </div>
                </div>

                {/* Card Name */}
                <div>
                  <label className="flex items-center gap-1.5 text-[12px] font-black text-slate-600 mb-2 uppercase tracking-wide">
                    <User size={12} strokeWidth={2.5} /> Name on Card
                  </label>
                  <input type="text" value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    placeholder="AS ON YOUR CARD"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition uppercase tracking-wide" />
                </div>

                {/* Expiry + CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-1.5 text-[12px] font-black text-slate-600 mb-2 uppercase tracking-wide">
                      <Calendar size={12} strokeWidth={2.5} /> Expiry
                    </label>
                    <input type="text" inputMode="numeric" value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-[12px] font-black text-slate-600 mb-2 uppercase tracking-wide">
                      <Shield size={12} strokeWidth={2.5} /> CVV
                    </label>
                    <input type="password" inputMode="numeric" value={cvv} maxLength={4}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      onFocus={() => setCvvFocused(true)}
                      onBlur={() => setCvvFocused(false)}
                      placeholder="•••"
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                  </div>
                </div>
              </div>

              {/* Amount + Pay button */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 flex justify-between items-center"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Amount to pay</p>
                  <p className="text-[22px] font-black text-slate-800">₹{total}</p>
                </div>
                <motion.button onClick={handleMockPayment} disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.04 }}
                  whileTap={{ scale: loading ? 1 : 0.96 }}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-black px-7 py-4 rounded-xl shadow-lg shadow-orange-200 transition-all text-[15px]">
                  {loading ? (
                    <>
                      <motion.div animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                      Processing...
                    </>
                  ) : (
                    <><Lock size={14} strokeWidth={2.5} /> Pay Now</>
                  )}
                </motion.button>
              </div>

              <p className="text-center text-[11px] text-slate-400 pb-2 flex items-center justify-center gap-1">
                <Lock size={10} strokeWidth={2.5} />
                256-bit SSL encrypted · Safe & Secure
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Checkout;
