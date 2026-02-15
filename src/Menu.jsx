import { useContext, useState } from 'react';
import { CartContext } from './CartContext';
import { Link } from 'react-router-dom';

const Menu = () => {
  const { addToCart } = useContext(CartContext);
  
  // Your same state, just wrapped in a beautiful new UI
  const [foodItems] = useState([
    { id: 1, name: "Veg Momos", price: 60 },
    { id: 2, name: "Chicken Biryani", price: 150 },
    { id: 3, name: "Cold Coffee", price: 80 }
  ]);

  return (
    // min-h-screen makes it take the full height of the device
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      
      {/* 🟢 THE HEADER */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Menu</h1>
        <div className="space-x-3">
          <Link to="/cart" className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-emerald-600 transition">
            Cart
          </Link>
          <Link to="/orders" className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-blue-600 transition">
            Kitchen
          </Link>
        </div>
      </div>

      {/* 🟢 THE FOOD GRID (2 columns on mobile) */}
      <div className="grid grid-cols-2 gap-4">
        {foodItems.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
            
            <h3 className="text-lg font-bold text-gray-800 text-center leading-tight mb-1">
              {item.name}
            </h3>
            
            <p className="text-gray-500 font-medium mb-4">
              ₹{item.price}
            </p>
            
            {/* The Zepto-style ADD button */}
            <button 
              onClick={() => addToCart(item)}
              className="w-full bg-orange-50 text-orange-600 font-bold py-2 rounded-lg border border-orange-200 hover:bg-orange-100 hover:scale-105 active:scale-95 transition-all"
            >
              ADD +
            </button>
            
          </div>
        ))}
      </div>

    </div>
  );
};

export default Menu;