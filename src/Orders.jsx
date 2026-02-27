import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Orders = () => {
  // 1. Start with an empty array of orders
  const [liveOrders, setLiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. The Watcher: Fetch data from the server as soon as the page loads
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders');
        const data = await response.json();
        
        setLiveOrders(data); // Save the server's data into our state!
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setLoading(false);
      }
    };

    // Run the function
    fetchOrders();
    
    // Optional: Make it refresh every 5 seconds so it feels like a live kitchen tablet!
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans flex flex-col">
      <div className="flex items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <Link to="/menu" className="text-gray-400 font-bold mr-4 hover:text-gray-800 transition">← Menu</Link>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Kitchen Dashboard</h1>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-10 font-bold">Connecting to Kitchen Server...</p>
      ) : liveOrders.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center mt-10">
          <div className="text-6xl mb-4">🍳</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">The kitchen is quiet!</h2>
          <p className="text-gray-500 mb-8 font-medium">Waiting for the first order to come in.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* We are now mapping over liveOrders from the server! */}
          {liveOrders.map((order, index) => (
            <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500"></div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order #{index + 101}</p>
                  <h3 className="text-lg font-black text-gray-800">Room {order.roomNumber}</h3>
                </div>
                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  Live
                </span>
              </div>
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