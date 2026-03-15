import { useContext, useState } from 'react';
import { CartContext } from './CartContext';
import { Link } from 'react-router-dom';

const Menu = () => {
  const { addToCart, cart } = useContext(CartContext);
  
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  
  const [foodItems] = useState([
    { id: 1, name: "Hostel Maggi", price: 40, category: "Snacks" },
    { id: 2, name: "Chicken Biryani", price: 150, category: "Meals" },
    { id: 3, name: "Kulhad Chai", price: 20, category: "Drinks" },
    { id: 4, name: "Paneer Roll", price: 80, category: "Snacks" },
    { id: 5, name: "Cold Coffee", price: 60, category: "Drinks" },
    { id: 6, name: "Veg Thali", price: 120, category: "Meals" }
  ]);

  const categories = ["All", "Snacks", "Meals", "Drinks"];

  
  const filteredItems = foodItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans pb-24">
      
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">CampusConnect</h1>
          <p className="text-sm text-gray-500 font-medium">Delivering to your hostel 🚀</p>
        </div>
        <div className="space-x-2 flex">
          <Link to="/orders" className="bg-white border border-gray-200 text-gray-700 p-2 rounded-full shadow-sm hover:bg-gray-100 transition">
             👨‍🍳
          </Link>
          <Link to="/cart" className="bg-emerald-500 text-white p-2 px-4 rounded-full font-bold shadow-sm hover:bg-emerald-600 transition flex items-center gap-2">
            🛒 {cart.length > 0 && <span className="bg-white text-emerald-600 rounded-full px-2 py-0.5 text-xs">{cart.length}</span>}
          </Link>
        </div>
      </div>

      
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-md mb-6">
        <h2 className="text-xl font-black mb-1">Late Night Cravings?</h2>
        <p className="text-sm font-medium opacity-90 mb-4">Get it delivered in 10 mins flat.</p>
        <button className="bg-white text-orange-600 text-sm font-bold px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform">
          Order Now
        </button>
      </div>

      
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search for Maggi, Chai..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-gray-200 p-4 rounded-xl shadow-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition"
        />
      </div>

      
      <div className="flex overflow-x-auto gap-3 mb-6 pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-5 py-2 rounded-full font-bold text-sm transition-all shadow-sm border ${
              activeCategory === cat 
                ? "bg-gray-800 text-white border-gray-800" 
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      
      <div className="grid grid-cols-2 gap-4">
        {filteredItems.length === 0 ? (
          <p className="col-span-2 text-center text-gray-500 py-10">No items found! 😢</p>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center relative overflow-hidden">
              <span className="absolute top-0 left-0 bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-br-lg uppercase">
                {item.category}
              </span>
              <h3 className="text-lg font-bold text-gray-800 text-center leading-tight mt-4 mb-1">{item.name}</h3>
              <p className="text-gray-500 font-medium mb-4">₹{item.price}</p>
              <button 
                onClick={() => addToCart(item)}
                className="w-full bg-orange-50 text-orange-600 font-bold py-2 rounded-lg border border-orange-200 hover:bg-orange-100 active:scale-95 transition-all"
              >
                ADD +
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default Menu;