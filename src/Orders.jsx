import { useContext } from 'react';
import { CartContext } from './CartContext';
import { Link } from 'react-router-dom';

const Orders = () => {
  const { orders } = useContext(CartContext);

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans flex flex-col">
      
      {/* 🟢 THE HEADER */}
      <div className="flex items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <Link to="/" className="text-gray-400 font-bold mr-4 hover:text-gray-800 transition">
          ← Home
        </Link>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Kitchen Dashboard</h1>
      </div>

      {/* 🟢 THE LOGIC: Is the kitchen empty? */}
      {orders.length === 0 ? (
        
        /* THE EMPTY STATE UI */
        <div className="flex-grow flex flex-col items-center justify-center text-center mt-10">
          <div className="text-6xl mb-4">🍳</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">The kitchen is quiet!</h2>
          <p className="text-gray-500 mb-8 font-medium">Waiting for the first order to come in.</p>
        </div>

      ) : (

        /* 🟢 THE LIVE ORDERS LIST */
        <div className="flex flex-col gap-4">
          {orders.map((order, index) => (
            // The Card Container (with a hidden overflow so the side-border looks clean)
            <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
              
              {/* Decorative Orange Side Border */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500"></div>

              {/* Top Row: Order ID and Badge */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {/* Fake order numbers starting at 101 to look professional */}
                    Order #{index + 101}
                  </p>
                  <h3 className="text-lg font-black text-gray-800">Room {order.roomNumber}</h3>
                </div>
                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">
                  New Order
                </span>
              </div>

              {/* Bottom Row: Customer & Total */}
              <div className="border-t border-gray-100 pt-3 mt-2 flex justify-between items-end">
                <div>
                  <p className="text-gray-600 font-medium text-sm">👤 {order.customerName}</p>
                  <p className="text-gray-500 text-sm mt-1">📦 {order.foodItems.length} items</p>
                </div>
                <p className="text-xl font-black text-green-500">₹{order.orderTotal}</p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;