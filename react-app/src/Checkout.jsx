import { useState, useContext } from 'react';
import { CartContext } from './CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, User, CheckCircle, Loader } from 'lucide-react';

const Checkout = () => {
  const { cart, clearCart, addOrder } = useContext(CartContext);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = async () => {
    if (name.trim() === '' || room.trim() === '') {
      alert('Please enter your name and room number!');
      return;
    }
    setLoading(true);
    const newOrder = { customerName: name, roomNumber: room, foodItems: cart, orderTotal: total };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      const data = await response.json();
      if (data.success) {
        addOrder(newOrder);
        setSuccess(true);
        setTimeout(() => { clearCart(); navigate('/'); }, 2200);
      } else {
        alert('Server received it, but something went wrong.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Could not connect to the backend! Is your server running?');
      setLoading(false);
    }
  };

  if (cart.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center font-sans p-4">
        <p className="text-4xl mb-4">🛒</p>
        <h2 className="text-[20px] font-black text-slate-700 mb-2">Cart is empty</h2>
        <button onClick={() => navigate('/menu')} className="mt-4 bg-orange-500 text-white font-black px-8 py-3 rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-colors">
          Go to Menu
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center font-sans p-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-500" strokeWidth={2} />
          </div>
          <h2 className="text-[24px] font-black text-slate-800 mb-2">Order Placed! 🎉</h2>
          <p className="text-slate-500 text-[14px]">Heading to your room shortly.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans pb-10">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100"
        style={{ WebkitBackdropFilter: 'blur(20px)' }}>
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/cart" className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
            <ArrowLeft size={15} className="text-slate-600" strokeWidth={2.5} />
          </Link>
          <h1 className="text-[16px] font-black text-slate-800">Checkout</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-4">

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 border border-slate-100"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
        >
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
        </motion.div>

        {/* Delivery Details */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="bg-white rounded-2xl p-5 border border-slate-100"
          style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
        >
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Delivery Details</p>

          <div className="mb-4">
            <label className="flex items-center gap-1.5 text-[12px] font-black text-slate-600 mb-2 uppercase tracking-wide">
              <User size={12} strokeWidth={2.5} /> Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bhumika Sharma"
              className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[12px] font-black text-slate-600 mb-2 uppercase tracking-wide">
              <MapPin size={12} strokeWidth={2.5} /> Room / Hostel Block
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. Block B, Room 304"
              className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
            />
          </div>
        </motion.div>

        {/* Place Order */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
          whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-[16px] font-black py-5 rounded-2xl shadow-lg shadow-orange-200 transition-all"
          >
            {loading ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white" />
                Placing Order...
              </>
            ) : (
              <>Confirm & Place Order — ₹{total}</>
            )}
          </button>
        </motion.div>

        <p className="text-center text-[11px] text-slate-400 pb-2">
          🔒 Secure order · Free delivery to your hostel
        </p>
      </div>
    </div>
  );
};

export default Checkout;
