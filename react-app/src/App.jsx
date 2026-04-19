import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
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
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/supplier/login" element={<SupplierLogin />} />

          {/* Protected Routes */}
          {/* /menu/:vendorId  → shows products for a specific vendor */}
          <Route path="/menu/:vendorId" element={
            <ProtectedRoute><Menu /></ProtectedRoute>
          } />

          {/* Legacy /menu fallback — redirects to home to pick a vendor */}
          <Route path="/menu" element={
            <ProtectedRoute><Menu /></ProtectedRoute>
          } />

          <Route path="/cart" element={
            <ProtectedRoute><Cart /></ProtectedRoute>
          } />

          <Route path="/checkout" element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />

          {/* Admin Only */}
          <Route path="/orders" element={
            <ProtectedRoute requiredRole="admin"><Orders /></ProtectedRoute>
          } />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
