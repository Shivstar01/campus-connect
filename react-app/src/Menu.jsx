import { useContext, useState, useEffect } from 'react';
import { CartContext } from './CartContext';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, ArrowLeft, Plus, Store } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 22, delay: i * 0.06 }
  })
};

// Vendor type → banner gradient & emoji
const VENDOR_THEME = {
  Food:       { gradient: 'from-orange-500 to-rose-500',   emoji: '🍛', hint: 'Hot meals & snacks delivered fast.' },
  Stationery: { gradient: 'from-blue-500 to-indigo-600',   emoji: '📚', hint: 'Everything you need for class.' },
  Print:      { gradient: 'from-violet-500 to-purple-600', emoji: '🖨️', hint: 'Fast printing, scanning & binding.' },
};

const Menu = () => {
  const { vendorId } = useParams();          // comes from /menu/:vendorId
  const navigate = useNavigate();
  const { addToCart, cart } = useContext(CartContext);

  const [vendor, setVendor]       = useState(null);
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [searchQuery, setSearch]  = useState('');
  const [activeCategory, setCat]  = useState('All');
  const [addedIds, setAddedIds]   = useState({});

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    // If no vendorId in URL, send user back to home to pick one
    if (!vendorId) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch vendor info and its products in parallel
        const [vendorRes, productsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/vendors/${vendorId}`),
          fetch(`${import.meta.env.VITE_API_URL}/api/products?vendorId=${vendorId}`)
        ]);

        if (!vendorRes.ok) throw new Error('Vendor not found');
        if (!productsRes.ok) throw new Error('Could not load products');

        const vendorData   = await vendorRes.json();
        const productsData = await productsRes.json();

        setVendor(vendorData);
        setProducts(productsData);
      } catch (err) {
        console.error('Menu fetch error:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [vendorId, navigate]);

  // Build category list dynamically from actual product data
  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesCat    = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAdd = (product) => {
    addToCart(product);
    setAddedIds(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => setAddedIds(prev => ({ ...prev, [product._id]: false })), 900);
  };

  // ── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center font-sans">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-10 h-10 rounded-full border-4 border-orange-200 border-t-orange-500 mx-auto mb-4" />
          <p className="text-slate-500 font-semibold text-sm">Loading shop...</p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center font-sans p-6 text-center">
        <p className="text-4xl mb-4">⚠️</p>
        <h2 className="text-[18px] font-black text-slate-700 mb-2">Couldn't load this shop</h2>
        <p className="text-slate-400 text-[13px] mb-6">{error}</p>
        <button onClick={() => navigate('/')}
          className="bg-orange-500 text-white font-black px-6 py-3 rounded-2xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-colors">
          ← Back to Home
        </button>
      </div>
    );
  }

  const theme = VENDOR_THEME[vendor?.vendorType] || VENDOR_THEME.Food;

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans pb-28">

      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100"
        style={{ WebkitBackdropFilter: 'blur(20px)' }}>
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <button onClick={() => navigate('/')}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors flex-shrink-0">
            <ArrowLeft size={15} className="text-slate-600" strokeWidth={2.5} />
          </button>

          {/* Search */}
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={2} />
            <input
              type="text"
              placeholder={`Search in ${vendor?.name || 'shop'}...`}
              value={searchQuery}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
            />
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-md shadow-orange-200 hover:bg-orange-600 transition-colors">
              <ShoppingCart size={15} className="text-white" strokeWidth={2.5} />
            </div>
            {cartCount > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {cartCount}
              </motion.span>
            )}
          </Link>
        </div>

        {/* Category Pills — built from real product data */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {categories.map(cat => (
            <motion.button
              key={cat} whileTap={{ scale: 0.95 }}
              onClick={() => setCat(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5">

        {/* ── Vendor Hero Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-r ${theme.gradient} rounded-2xl p-5 text-white shadow-lg mb-6`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Store size={13} className="text-white/70" strokeWidth={2} />
                <span className="text-[11px] font-black text-white/70 uppercase tracking-widest">{vendor?.vendorType}</span>
              </div>
              <h2 className="text-[22px] font-black leading-tight mb-1">{vendor?.name}</h2>
              <p className="text-[13px] text-white/80 mb-1">{vendor?.description || theme.hint}</p>
              <p className="text-[11px] text-white/60">📍 {vendor?.location}</p>
            </div>
            <div className="text-5xl ml-3 opacity-90">{theme.emoji}</div>
          </div>

          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/20">
            <span className="text-[12px] font-bold">⭐ {vendor?.rating?.toFixed(1)}</span>
            <span className="text-white/40">·</span>
            <span className={`text-[12px] font-bold ${vendor?.isOpen ? 'text-green-300' : 'text-red-300'}`}>
              {vendor?.isOpen ? '🟢 Open now' : '🔴 Closed'}
            </span>
            <span className="text-white/40">·</span>
            <span className="text-[12px] text-white/70">{products.length} items</span>
          </div>
        </motion.div>

        {/* ── Results count ── */}
        <p className="text-[12px] text-slate-400 font-semibold mb-3">
          {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
          {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
        </p>

        {/* ── Product Grid ── */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">😢</p>
            <p className="text-slate-500 font-semibold">Nothing matches your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product._id}
                custom={i} variants={fadeUp} initial="hidden" animate="visible"
                whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
              >
                {/* Colour top block */}
                <div className={`h-20 bg-gradient-to-br ${theme.gradient} bg-opacity-10 flex items-center justify-center relative`}
                  style={{ background: 'linear-gradient(135deg, #fff7ed, #ffedd5)' }}>
                  <span className="text-4xl">{theme.emoji}</span>
                  <span className="absolute top-2 left-2 bg-white/80 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {product.category}
                  </span>
                </div>

                <div className="p-3">
                  <p className="text-[13px] font-black text-slate-800 leading-tight mb-0.5">{product.name}</p>
                  {product.description && (
                    <p className="text-[10px] text-slate-400 mb-1 leading-tight line-clamp-2">{product.description}</p>
                  )}
                  <p className="text-orange-500 font-black text-[15px] mb-3">₹{product.price}</p>

                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleAdd(product)}
                    className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-black transition-all ${
                      addedIds[product._id]
                        ? 'bg-green-500 text-white'
                        : 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100'
                    }`}
                  >
                    {addedIds[product._id]
                      ? '✓ Added!'
                      : <><Plus size={13} strokeWidth={3} /> ADD</>
                    }
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Floating Cart Bar ── */}
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-5 left-4 right-4 z-50 max-w-2xl mx-auto"
        >
          <Link to="/cart"
            className="flex items-center justify-between bg-slate-800 text-white px-5 py-4 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-orange-500 text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center">{cartCount}</span>
              <span className="text-[14px] font-bold">View Cart</span>
            </div>
            <span className="text-[13px] font-black text-orange-400">Checkout →</span>
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Menu;
