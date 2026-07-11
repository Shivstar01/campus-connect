import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ChevronRight, LogOut, LayoutDashboard,
  UtensilsCrossed, Star, Clock, Flame,
  BookOpen, Printer, ShoppingBag, Zap, Coffee
} from 'lucide-react';

// ─── Animation variants ───────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 22, delay: i * 0.08 }
  })
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

// ─── Static display data ──────────────────────────────────────
const DEALS = [
  { id: 1, emoji: '🍕', title: 'Veg Supreme Thali', tag: '40% OFF',    sub: 'Hostel Mess · Today only',      color: 'from-orange-500 to-rose-500' },
  { id: 2, emoji: '📓', title: 'A4 Notebook Deal',  tag: 'COMBO DEAL', sub: 'Campus Needs · Limited stock',  color: 'from-blue-500 to-indigo-500' },
  { id: 3, emoji: '🖨️', title: 'Print 10 Get 2 Free', tag: 'FREE PAGES', sub: 'Main Block Xerox · All day', color: 'from-violet-500 to-purple-500' },
  { id: 4, emoji: '🍔', title: 'Double Smash Burger', tag: '₹30 OFF',  sub: 'Hostel Mess · 2 left',          color: 'from-yellow-500 to-orange-500' },
];

const CATEGORIES = [
  { label: 'Food',       icon: UtensilsCrossed, color: '#f97316', vendorType: 'Food' },
  { label: 'Stationery', icon: BookOpen,        color: '#3b82f6', vendorType: 'Stationery' },
  { label: 'Printing',   icon: Printer,         color: '#8b5cf6', vendorType: 'Print' },
  { label: 'Snacks',     icon: ShoppingBag,     color: '#f59e0b', vendorType: 'Food' },
  { label: 'Drinks',     icon: Coffee,          color: '#22c55e', vendorType: 'Food' },
  { label: 'Express',    icon: Zap,             color: '#ef4444', vendorType: 'Food' },
];

// Map vendorType → visual identity
const VENDOR_STYLE = {
  Food:        { emoji: '🍛', bg: 'from-orange-50 to-amber-50',   badge: 'bg-orange-100 text-orange-700',  accent: '#f97316' },
  Stationery:  { emoji: '📚', bg: 'from-blue-50 to-indigo-50',    badge: 'bg-blue-100 text-blue-700',      accent: '#3b82f6' },
  Print:       { emoji: '🖨️', bg: 'from-violet-50 to-purple-50', badge: 'bg-violet-100 text-violet-700',  accent: '#8b5cf6' },
};

// ─── Component ────────────────────────────────────────────────
const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [vendors, setVendors]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // Fetch real vendors from the backend
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vendors`);
        if (!res.ok) throw new Error('Failed to fetch vendors');
        const data = await res.json();
        setVendors(data);
      } catch (err) {
        console.error('Vendor fetch error:', err);
        setError('Could not load shops. Is the server running?');
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans">

      {/* ── Glassmorphic Sticky Nav ── */}
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        className="sticky top-0 z-50 w-full"
        style={{
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(234,88,12,0.10)',
          boxShadow: '0 2px 24px rgba(0,0,0,0.06)'
        }}
      >
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-md shadow-orange-200">
              <UtensilsCrossed size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[17px] font-black tracking-tight text-slate-800">
              Campus<span className="text-orange-500">Connect</span>
            </span>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              {user.role !== 'admin' && (
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/cart" className="text-[13px] font-bold text-slate-600 hover:text-orange-500 transition-colors">🛒 Cart</Link>
                </motion.div>
              )}
              <div className="text-right hidden sm:block">
                <p className="text-[11px] text-slate-400 leading-none">Hey there 👋</p>
                <p className="text-[13px] font-bold text-slate-700 leading-tight">{user.name}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                onClick={logout}
                className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
              >
                <LogOut size={15} strokeWidth={2.2} />
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link to="/login" className="text-[13px] font-semibold text-slate-600 hover:text-orange-500 transition-colors">Log In</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
                <Link to="/signup" className="text-[13px] font-bold px-4 py-2 rounded-xl bg-orange-500 text-white shadow-md shadow-orange-200 hover:bg-orange-600 transition-colors">Sign Up</Link>
              </motion.div>
            </div>
          )}
        </div>
      </motion.header>

      <main className="max-w-2xl mx-auto px-4 pb-16">

        {/* ── Hero Greeting ── */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="pt-7 pb-5">
          {user ? (
            <>
              <p className="text-slate-400 text-[13px] font-medium mb-0.5">Good afternoon 🌤</p>
              <h1 className="text-[28px] font-black text-slate-800 leading-tight tracking-tight">
                What do you need,<br /><span className="text-orange-500">{user.name.split(' ')[0]}?</span>
              </h1>
            </>
          ) : (
            <>
              <p className="text-slate-400 text-[13px] font-medium mb-0.5">Welcome to</p>
              <h1 className="text-[30px] font-black text-slate-800 leading-tight tracking-tight">
                Campus<span className="text-orange-500">Connect</span> 🎓
              </h1>
              <p className="text-slate-500 text-[14px] mt-1">Food · Stationery · Printing — all in one place.</p>
            </>
          )}
        </motion.div>

        {/* ── CTA Buttons ── */}
        <AnimatePresence>
          {!user && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-3 mb-6">
              <motion.div className="flex-1" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-[15px] font-black py-6 rounded-2xl shadow-lg shadow-orange-200">
                  <Link to="/login">Log In</Link>
                </Button>
              </motion.div>
              <motion.div className="flex-1" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button asChild variant="outline" className="w-full text-[15px] font-bold py-6 rounded-2xl border-slate-200 text-slate-700">
                  <Link to="/signup">Create Account</Link>
                </Button>
              </motion.div>
            </motion.div>
          )}

          {user && user.role === 'admin' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button asChild className="w-full bg-slate-800 hover:bg-slate-900 text-[15px] font-black py-6 rounded-2xl shadow-lg">
                <Link to="/orders" className="flex items-center justify-center gap-2">
                  <LayoutDashboard size={18} strokeWidth={2.2} /> Kitchen Dashboard
                </Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Hot Deals ── */}
        <motion.section variants={fadeUp} initial="hidden" animate="visible" custom={2} className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Flame size={15} className="text-orange-500" strokeWidth={2.5} />
              <h2 className="text-[15px] font-black text-slate-800">Hot Deals</h2>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
            {DEALS.map((deal, i) => (
              <motion.div
                key={deal.id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}
                onClick={() => user && navigate('/menu/' + (vendors.find(v => v.vendorType === 'Food')?._id || ''))}
                className={`snap-start flex-shrink-0 w-[200px] rounded-2xl bg-gradient-to-br ${deal.color} p-4 cursor-pointer shadow-lg`}
              >
                <div className="text-3xl mb-2">{deal.emoji}</div>
                <span className="text-[10px] font-black bg-white/25 text-white px-2 py-0.5 rounded-full">{deal.tag}</span>
                <p className="text-white font-black text-[14px] mt-2 leading-tight">{deal.title}</p>
                <p className="text-white/70 text-[11px] mt-1">{deal.sub}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Quick Categories ── */}
        <motion.section variants={fadeUp} initial="hidden" animate="visible" custom={3} className="mb-7">
          <h2 className="text-[15px] font-black text-slate-800 mb-3">Browse by Category</h2>
          <div className="flex gap-4 overflow-x-auto pb-1 -mx-4 px-4 snap-x" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat, i) => {
              const targetVendor = vendors.find(v => v.vendorType === cat.vendorType);
              return (
                <motion.div
                  key={cat.label} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                  whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.93 }}
                  onClick={() => user && targetVendor && navigate(`/menu/${targetVendor._id}`)}
                  className="snap-start flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
                    style={{ background: cat.color + '18', border: `1.5px solid ${cat.color}28` }}>
                    <cat.icon size={22} style={{ color: cat.color }} strokeWidth={2} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">{cat.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── Campus Shops (real data) ── */}
        <motion.section variants={staggerContainer} initial="hidden" animate="visible">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-black text-slate-800">Campus Shops</h2>
            <span className="text-[12px] text-slate-400">{vendors.length} open now</span>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3].map(i => (
                <div key={i} className="rounded-2xl bg-slate-100 animate-pulse h-36" />
              ))}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
              <p className="text-2xl mb-2">⚠️</p>
              <p className="text-red-500 font-bold text-[13px]">{error}</p>
            </div>
          )}

          {/* Real vendor cards */}
          {!loading && !error && (
            <div className="grid grid-cols-2 gap-3">
              {vendors.map((vendor, i) => {
                const style = VENDOR_STYLE[vendor.vendorType] || VENDOR_STYLE.Food;
                return (
                  <motion.div
                    key={vendor._id}
                    variants={fadeUp} custom={i}
                    whileHover={{ scale: 1.025, y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}
                    whileTap={{ scale: 0.975 }}
                    onClick={() => user ? navigate(`/menu/${vendor._id}`) : navigate('/login')}
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${style.bg} cursor-pointer border border-white/80`}
                    style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
                  >
                    {/* Watermark emoji */}
                    <div className="absolute -right-3 -top-3 text-6xl opacity-[0.12] select-none pointer-events-none">
                      {style.emoji}
                    </div>

                    <div className="relative p-4">
                      {/* Type badge */}
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${style.badge}`}>
                        {vendor.vendorType}
                      </span>

                      <div className="text-3xl mt-3 mb-1">{style.emoji}</div>
                      <p className="text-[14px] font-black text-slate-800 leading-tight">{vendor.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-tight truncate">{vendor.location}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <Star size={10} style={{ color: style.accent }} fill={style.accent} />
                          <span className="text-[11px] font-bold text-slate-600">{vendor.rating.toFixed(1)}</span>
                        </div>
                        <div className="w-px h-3 bg-slate-200" />
                        <div className="flex items-center gap-1">
                          <Clock size={10} className="text-slate-400" />
                          <span className="text-[11px] text-slate-500">
                            {vendor.isOpen ? 'Open now' : 'Closed'}
                          </span>
                        </div>
                      </div>

                      {/* Open/closed indicator */}
                      <div className="mt-2 flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${vendor.isOpen ? 'bg-green-500' : 'bg-red-400'}`} />
                        <span className={`text-[10px] font-bold ${vendor.isOpen ? 'text-green-600' : 'text-red-400'}`}>
                          {vendor.isOpen ? 'Accepting orders' : 'Currently closed'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Empty state — server returned no vendors */}
          {!loading && !error && vendors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-3xl mb-3">🏪</p>
              <p className="text-slate-500 font-semibold text-[14px]">No shops found.</p>
              <p className="text-slate-400 text-[12px] mt-1">Run <code className="bg-slate-100 px-1 rounded">node seed.js</code> in your Backend folder.</p>
            </div>
          )}
        </motion.section>

      </main>
    </div>
  );
};

export default Home;
