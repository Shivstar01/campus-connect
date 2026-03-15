import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Home = () => {
  
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-orange-500 flex flex-col items-center justify-center p-4 font-sans text-center">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full">
        <div className="text-6xl mb-6">🍔</div>
        <h1 className="text-4xl font-black text-gray-800 tracking-tight mb-2">CampusConnect</h1>
        <p className="text-gray-500 font-medium mb-8">Hyper-local food delivery for your hostel.</p>

        
        {user ? (
          <div className="space-y-4">
            <p className="text-lg font-bold text-gray-700">Welcome back, {user.name}!</p>
            
            
            {user.role === 'admin' ? (
              <Link to="/orders" className="block w-full bg-orange-500 text-white text-xl font-black py-4 rounded-xl shadow-md hover:bg-orange-600 active:scale-95 transition-all">
                Go to Kitchen Dashboard
              </Link>
            ) : (
              <Link to="/menu" className="block w-full bg-orange-500 text-white text-xl font-black py-4 rounded-xl shadow-md hover:bg-orange-600 active:scale-95 transition-all">
                Order Food Now
              </Link>
            )}
            
            <button 
              onClick={logout}
              className="block w-full bg-gray-100 text-gray-600 text-lg font-bold py-3 rounded-xl hover:bg-gray-200 transition-all"
            >
              Log Out
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            
            <Link to="/login" className="block w-full bg-orange-500 text-white text-xl font-black py-4 rounded-xl shadow-md hover:bg-orange-600 active:scale-95 transition-all">
              Log In
            </Link>
            <Link to="/signup" className="block w-full bg-orange-100 text-orange-600 text-xl font-black py-4 rounded-xl shadow-sm hover:bg-orange-200 active:scale-95 transition-all">
              Create an Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;