import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import Home from './Home';
import Menu from './Menu';
import Cart from './Cart';
import Checkout from './Checkout';
import Orders from './Orders';
import Login from './Login';
import Signup from './Signup';
import SupplierLogin from './SupplierLogin';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/supplier/login" element={<SupplierLogin />} />
        <Route path="/menu/:vendorId" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
        <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute requiredRole="admin"><Orders /></ProtectedRoute>} />
      </Routes>
    </CartProvider>
  );
}

export default App;