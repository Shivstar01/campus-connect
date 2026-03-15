import { useContext } from 'react';
import { CartContext } from './CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  
  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans flex flex-col">
      <div className="flex items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <Link to="/" className="text-gray-400 font-bold mr-4 hover:text-gray-800 transition">
          ← Back
        </Link>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Your Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center mt-10">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Cart is empty!</h2>
          <p className="text-gray-500 mb-8 font-medium">Looks like you haven't added any food yet.</p>
          <Link to="/menu" className="bg-orange-50 text-orange-600 border border-orange-200 px-8 py-3 rounded-xl font-bold hover:bg-orange-100 transition-all">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="flex-grow flex flex-col gap-3">
          {cart.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              
              
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <p className="text-gray-500 font-medium">₹{item.price} each</p>
              </div>
              
              
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                
                
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => updateQuantity(index, -1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 font-bold bg-white rounded shadow-sm hover:bg-gray-50 active:scale-95 transition"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-gray-800">
                    {item.quantity || 1}
                  </span>
                  <button 
                    onClick={() => updateQuantity(index, 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-600 font-bold bg-white rounded shadow-sm hover:bg-gray-50 active:scale-95 transition"
                  >
                    +
                  </button>
                </div>

                
                <button 
                  onClick={() => removeFromCart(index)}
                  className="text-red-500 font-bold bg-red-50 p-2 rounded-lg hover:bg-red-100 active:scale-95 transition-all flex items-center justify-center"
                  aria-label="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

              </div>
            </div>
          ))}

          
          <div className="mt-6 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
              <span className="text-gray-500 font-bold text-lg">Item Total</span>
              <span className="text-2xl font-black text-gray-800">₹{total}</span>
            </div>
            
            <Link 
              to="/checkout" 
              className="block w-full text-center bg-green-500 text-white text-lg font-bold py-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all"
            >
              Proceed to Checkout (₹{total})
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;