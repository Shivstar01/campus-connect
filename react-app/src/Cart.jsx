import { useContext } from 'react';
import { CartContext } from './CartContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100"
        style={{ WebkitBackdropFilter: 'blur(20px)' }}>
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/menu" className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors">
            <ArrowLeft size={15} className="text-slate-600" strokeWidth={2.5} />
          </Link>
          <div>
            <h1 className="text-[16px] font-black text-slate-800 leading-none">Your Cart</h1>
            {cart.length > 0 && <p className="text-[11px] text-slate-400 mt-0.5">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5">
        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center pt-24"
          >
            <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mb-5">
              <ShoppingBag size={32} className="text-orange-300" strokeWidth={1.5} />
            </div>
            <h2 className="text-[20px] font-black text-slate-700 mb-2">Cart is empty</h2>
            <p className="text-slate-400 text-[14px] mb-6">Add some delicious food to get started!</p>
            <Link to="/menu" className="bg-orange-500 text-white font-black text-[14px] px-8 py-3 rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-colors">
              Browse Menu
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="space-y-3 mb-5">
              <AnimatePresence>
                {cart.map((item, index) => (
                  <motion.div
                    key={item._id || index}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-slate-100"
                    style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
                  >
                    {/* Emoji */}
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-2xl">
                      {item.emoji || '🍽️'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-black text-slate-800 truncate">{item.name}</p>
                      <p className="text-[13px] text-orange-500 font-bold">₹{item.price} each</p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={() => updateQuantity(index, -1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                      >
                        <Minus size={12} strokeWidth={3} className="text-slate-600" />
                      </motion.button>
                      <span className="w-6 text-center text-[14px] font-black text-slate-800">{item.quantity || 1}</span>
                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={() => updateQuantity(index, 1)}
                        className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-colors"
                      >
                        <Plus size={12} strokeWidth={3} className="text-white" />
                      </motion.button>
                    </div>

                    {/* Subtotal + delete */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <p className="text-[13px] font-black text-slate-700">₹{item.price * (item.quantity || 1)}</p>
                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={() => removeFromCart(index)}
                        className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={11} className="text-red-400" strokeWidth={2.5} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Bill Summary */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-5 border border-slate-100 mb-5"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
            >
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Bill Summary</p>
              <div className="space-y-2.5">
                <div className="flex justify-between text-[13px] text-slate-500">
                  <span>Item total</span><span className="font-semibold text-slate-700">₹{total}</span>
                </div>
                <div className="flex justify-between text-[13px] text-slate-500">
                  <span>Delivery fee</span><span className="font-semibold text-green-500">FREE</span>
                </div>
                <div className="border-t border-dashed border-slate-200 pt-2.5 flex justify-between">
                  <span className="text-[14px] font-black text-slate-800">Total</span>
                  <span className="text-[18px] font-black text-orange-500">₹{total}</span>
                </div>
              </div>
            </motion.div>

            {/* Checkout Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/checkout"
                className="flex items-center justify-between w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-2xl shadow-lg shadow-orange-200 transition-colors"
              >
                <span className="text-[15px] font-black">Proceed to Checkout</span>
                <span className="text-[15px] font-black">₹{total} →</span>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
