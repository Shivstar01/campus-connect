import { useState, useContext } from 'react';
import { CartContext } from './CartContext';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
  const { cart, clearCart, addOrder } = useContext(CartContext);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

 
  const handlePlaceOrder = async () => {
    if (name.trim() === "" || room.trim() === "") {
      alert("Please enter your name and room number!");
      return; 
    }

    
    const newOrder = {
      customerName: name,
      roomNumber: room,
      foodItems: cart,
      orderTotal: total 
    };

    try {
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder), 
      });

      
      const data = await response.json();

      
      if (data.success) {
        addOrder(newOrder);
        alert(`Order sent to server! Receipt: ${data.message}`);
        clearCart();
        navigate('/');
      } else {
        alert("Server received it, but something went wrong.");
      }

    } catch (error) {
      console.error("Connection error:", error);
      alert("Could not connect to the backend! Is your server running?");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center font-sans">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty!</h2>
        <button onClick={() => navigate('/')} className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-orange-600 transition">
          Go to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <div className="flex items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <Link to="/cart" className="text-gray-400 font-bold mr-4 hover:text-gray-800 transition">← Back</Link>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">Checkout</h1>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Order Summary</h2>
        <div className="flex justify-between items-end">
          <p className="text-gray-600 font-medium">Items: {cart.length}</p>
          <p className="text-3xl font-black text-green-500">₹{total}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Delivery Details</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2 text-sm">Your Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bhumika" className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition" />
        </div>
        <div className="mb-8">
          <label className="block text-gray-700 font-bold mb-2 text-sm">Room / Hostel Block</label>
          <input type="text" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. Block B, Room 304" className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition" />
        </div>
        <button onClick={handlePlaceOrder} className="w-full bg-orange-500 text-white text-xl font-black py-4 rounded-xl shadow-md hover:bg-orange-600 active:scale-95 transition-all flex justify-center items-center gap-2">
          Confirm & Pay
        </button>
      </div>
    </div>
  );
};

export default Checkout;