import { useContext } from 'react';
import { CartContext } from './CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  // We grab the cart, and the removeFromCart tool if you added it earlier!
  const { cart, removeFromCart } = useContext(CartContext);

  // Calculate the total dynamically
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans flex flex-col">
      
      {/* 🟢 THE HEADER */}
      <div className="flex items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <Link to="/" className="text-gray-400 font-bold mr-4 hover:text-gray-800 transition">
          ← Back
        </Link>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Your Cart</h1>
      </div>

      {/* 🟢 THE LOGIC: Is the cart empty? */}
      {cart.length === 0 ? (
        
        /* THE EMPTY STATE UI */
        <div className="flex-grow flex flex-col items-center justify-center text-center mt-10">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Cart is empty!</h2>
          <p className="text-gray-500 mb-8 font-medium">Looks like you haven't added any food yet.</p>
          <Link to="/" className="bg-orange-50 text-orange-600 border border-orange-200 px-8 py-3 rounded-xl font-bold hover:bg-orange-100 transition-all">
            Browse Menu
          </Link>
        </div>

      ) : (

        /* THE FILLED CART UI */
        <div className="flex-grow flex flex-col gap-3">
          
          {/* The List of Items */}
          {cart.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <p className="text-gray-500 font-medium">₹{item.price}</p>
              </div>
              
              {/* Optional Remove Button (only shows if you have the removeFromCart function) */}
              {removeFromCart && (
                <button 
                  onClick={() => removeFromCart(index)}
                  className="text-red-500 font-bold bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 active:scale-95 transition-all"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          {/* THE BILLING & CHECKOUT SECTION */}
          <div className="mt-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
              <span className="text-gray-500 font-bold text-lg">Item Total</span>
              <span className="text-2xl font-black text-gray-800">₹{total}</span>
            </div>
            
            <Link 
              to="/checkout" 
              className="block w-full text-center bg-green-500 text-white text-lg font-bold py-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all"
            >
              Proceed to Checkout
            </Link>
          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;