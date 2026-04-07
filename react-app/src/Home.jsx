import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Home = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-orange-500 flex flex-col items-center justify-center p-4 font-sans text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0  }} 
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full"
      >
        <div className="text-6xl mb-6">🍔</div>
        <h1 className="text-4xl font-black text-gray-800 tracking-tight mb-2">CampusConnect</h1>
        <p className="text-gray-500 font-medium mb-8">Hyper-local food delivery for your hostel.</p>

        {user ? (
          <div className="space-y-4">
            <p className="text-lg font-bold text-gray-700">Welcome back, {user.name}!</p>
            
            {user.role === 'admin' ? (
              <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-xl font-black py-6 rounded-xl shadow-md">
                <Link to="/orders">Go to Kitchen Dashboard</Link>
              </Button>
            ) : (
              <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-xl font-black py-6 rounded-xl shadow-md">
                <Link to="/menu">Order Food Now</Link>
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={logout} 
              className="w-full text-lg font-bold py-6 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-100"
            >
              Log Out
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-xl font-black py-6 rounded-xl shadow-md">
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full bg-orange-100 text-orange-600 hover:bg-orange-200 text-xl font-black py-6 rounded-xl shadow-sm">
              <Link to="/signup">Create an Account</Link>
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Home;