import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Zap, Leaf, Coffee, Pizza, ShoppingBag, ChevronRight,
  LogOut, LayoutDashboard, UtensilsCrossed, Star, Clock, Flame
} from 'lucide-react';

/* ─── Animation Variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 22, delay: i * 0.08 }
  })
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } }
};

const cardHover = {
  rest: { scale: 1, y: 0, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
  hover: { scale: 1.025, y: -4, boxShadow: '0 16px 40px rgba(234,88,12,0.18)' },
  tap: { scale: 0.975 }
};

/* ─── Data ───────────────────────────────────────────────── */
const DEALS = [
  { id: 1, emoji: '🍕', title: 'Veg Supreme Thali', tag: '40% OFF', sub: 'Mess Block · Today only', color: 'from-orange-500 to-rose-500' },
  { id: 2, emoji: '🥗', title: 'Power Protein Bowl', tag: 'FREE DRINK', sub: 'Health Hub · Limited', color: 'from-emerald-500 to-teal-500' },
  { id: 3, emoji: '🍔', title: 'Double Smash Burger', tag: '₹30 OFF', sub: 'Fast Bites · 2 left', color: 'from-yellow-500 to-orange-500' },
  { id: 4, emoji: '☕', title: 'Cold Brew + Snack', tag: 'COMBO DEAL', sub: 'Café Corner · All day', color: 'from-violet-500 to-purple-500' },
];

const CATEGORIES = [
  { label: 'Fast Food', icon: Zap, color: '#f97316' },
  { label: 'Healthy', icon: Leaf, color: '#22c55e' },
  { label: 'Drinks', icon: Coffee, color: '#a855f7' },
  { label: 'Pizza', icon: Pizza, color: '#ef4444' },
  { label: 'Snacks', icon: ShoppingBag, color: '#f59e0b' },
];

const CANTEENS = [
  {
    id: 1, name: 'The Mess Block', tag: 'Most Popular', rating: '4.8',
    time: '8–10 min', items: '42 items', emoji: '🍛',
    accent: '#f97316', bg: 'from-orange-50 to-amber-50',
    badge: 'bg-orange-100 text-orange-700'
  },
  {
    id: 2, name: 'Health Hub', tag: 'Trending', rating: '4.6',
    time: '5–7 min', items: '28 items', emoji: '🥗',
    accent: '#22c55e', bg: 'from-emerald-50 to-green-50',
    badge: 'bg-emerald-100 text-emerald-700'
  },
  {
    id: 3, name: 'Fast Bites', tag: 'Quick Pickup', rating: '4.5',
    time: '3–5 min', items: '19 items', emoji: '🍔',
    accent: '#8b5cf6', bg: 'from-violet-50 to-purple-50',
    badge: 'bg-violet-100 text-violet-700'
  },
  {
    id: 4, name: 'Café Corner', tag: 'New', rating: '4.7',
    time: '6–8 min', items: '33 items', emoji: '☕',
    accent: '#0ea5e9', bg: 'from-sky-50 to-blue-50',
    badge: 'bg-sky-100 text-sky-700'
  },
];

/* ─── Component ──────────────────────────────────────────── */
const Home = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans">

      {/* ── Glassmorphic Sticky Nav ─────────────────────── */}
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
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-md shadow-orange-200">
              <UtensilsCrossed size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[17px] font-black tracking-tight text-slate-800">
              Campus<span className="text-orange-500">Connect</span>
            </span>
          </div>

          {/* Right side */}
          {user ? (
            <div className="flex items-center gap-2">
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
                <Link to="/login" className="text-[13px] font-semibold text-slate-600 hover:text-orange-500 transition-colors">
                  Log In
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
                <Link to="/signup"
                  className="text-[13px] font-bold px-4 py-2 rounded-xl bg-orange-500 text-white shadow-md shadow-orange-200 hover:bg-orange-600 transition-colors"
                >
                  Sign Up
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </motion.header>

      <main className="max-w-2xl mx-auto px-4 pb-16">

        {/* ── Hero Greeting ───────────────────────────── */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="pt-7 pb-5"
        >
          {user ? (
            <>
              <p className="text-slate-400 text-[13px] font-medium mb-0.5">Good afternoon 🌤</p>
              <h1 className="text-[28px] font-black text-slate-800 leading-tight tracking-tight">
                What are you craving,<br />
                <span className="text-orange-500">{user.name.split(' ')[0]}?</span>
              </h1>
            </>
          ) : (
            <>
              <p className="text-slate-400 text-[13px] font-medium mb-0.5">Welcome to</p>
              <h1 className="text-[30px] font-black text-slate-800 leading-tight tracking-tight">
                Campus<span className="text-orange-500">Connect</span> 🍔
              </h1>
              <p className="text-slate-500 text-[14px] mt-1">Hyper-local food delivery for your campus.</p>
            </>
          )}
        </motion.div>

        {/* ── CTA Buttons (Auth State) ─────────────────── */}
        <AnimatePresence>
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ delay: 0.1 }}
              className="flex gap-3 mb-6"
            >
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
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            >
              <Button asChild className="w-full bg-slate-800 hover:bg-slate-900 text-[15px] font-black py-6 rounded-2xl shadow-lg">
                <Link to="/orders" className="flex items-center justify-center gap-2">
                  <LayoutDashboard size={18} strokeWidth={2.2} />
                  Kitchen Dashboard
                </Link>
              </Button>
            </motion.div>
          )}

          {user && user.role !== 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            >
              <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-[15px] font-black py-6 rounded-2xl shadow-lg shadow-orange-200">
                <Link to="/menu" className="flex items-center justify-center gap-2">
                  Order Food Now
                  <ChevronRight size={18} strokeWidth={2.5} />
                </Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Hot Deals Horizontal Scroll ──────────────── */}
        <motion.section variants={fadeUp} initial="hidden" animate="visible" custom={2} className="mb-7">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Flame size={15} className="text-orange-500" strokeWidth={2.5} />
              <h2 className="text-[15px] font-black text-slate-800">Hot Deals</h2>
            </div>
            <span className="text-[12px] font-semibold text-orange-500 cursor-pointer hover:underline">See all</span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {DEALS.map((deal, i) => (
              <motion.div
                key={deal.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
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

        {/* ── Quick Categories ─────────────────────────── */}
        <motion.section variants={fadeUp} initial="hidden" animate="visible" custom={3} className="mb-7">
          <h2 className="text-[15px] font-black text-slate-800 mb-3">Browse by Category</h2>
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 snap-x scrollbar-none"
            style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.93 }}
                className="snap-start flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{ background: cat.color + '18', border: `1.5px solid ${cat.color}28` }}>
                  <cat.icon size={22} style={{ color: cat.color }} strokeWidth={2} />
                </div>
                <span className="text-[11px] font-bold text-slate-600">{cat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Campus Kitchens Bento Grid ───────────────── */}
        <motion.section variants={staggerContainer} initial="hidden" animate="visible">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-black text-slate-800">Campus Kitchens</h2>
            <span className="text-[12px] font-semibold text-orange-500 cursor-pointer hover:underline">View all</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {CANTEENS.map((c, i) => (
              <motion.div
                key={c.id}
                variants={fadeUp}
                custom={i}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                animate="rest"
                // @ts-ignore — framer-motion accepts variant map
                variants={cardHover}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.bg} cursor-pointer border border-white/80`}
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
              >
                {/* Large emoji bg */}
                <div className="absolute -right-3 -top-3 text-6xl opacity-[0.13] select-none pointer-events-none">
                  {c.emoji}
                </div>

                <div className="relative p-4">
                  {/* Tag badge */}
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${c.badge}`}>
                    {c.tag}
                  </span>

                  {/* Emoji */}
                  <div className="text-3xl mt-3 mb-1">{c.emoji}</div>

                  {/* Name */}
                  <p className="text-[14px] font-black text-slate-800 leading-tight">{c.name}</p>

                  {/* Meta row */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star size={10} style={{ color: c.accent }} fill={c.accent} />
                      <span className="text-[11px] font-bold text-slate-600">{c.rating}</span>
                    </div>
                    <div className="w-px h-3 bg-slate-200" />
                    <div className="flex items-center gap-1">
                      <Clock size={10} className="text-slate-400" />
                      <span className="text-[11px] text-slate-500">{c.time}</span>
                    </div>
                  </div>

                  {/* Items count */}
                  <p className="text-[10px] text-slate-400 font-medium mt-1">{c.items}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </main>
    </div>
  );
};

export default Home;