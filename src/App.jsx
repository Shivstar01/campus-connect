import { Routes, Route, Link } from 'react-router-dom';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
import Home from './Home';
import Menu from './Menu';
import Cart from './Cart';
import Checkout from './Checkout';
import { useContext } from 'react';
import { CartContext } from './CartContext';
import Orders from './Orders';
import Login from './Login';
import Signup from './Signup';
import SupplierLogin from './SupplierLogin';

// Import our new Guard component
import ProtectedRoute from './ProtectedRoute';

function CartIcon() {
  const { cart } = useContext(CartContext);
  return (
    <Link to="/cart" style={{ fontWeight: "bold", textDecoration: "none", color: "black" }}>
      🛒 Cart: {cart.length}
    </Link>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        
          <div className="app">
            <nav style={{ padding: 20, borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between" }}>
              <div>
                <Link to="/" style={{ marginRight: 20 }}>Home</Link>
                <Link to="/menu">Food Menu</Link>
              </div>
              <CartIcon />
            </nav>

            <Routes>
              {/* Public Routes - Anyone can access these */}
              <Route path="/" element={<Home />} />
              <Route path ="/login" element={<Login />}/>
              <Route path="/signup" element={<Signup />} />
              <Route path="/supplier/login" element={<SupplierLogin />} />
              
              {/* Protected Routes - Guarded by ProtectedRoute */}
              <Route path="/menu" element={
                <ProtectedRoute>
                  <Menu />
                </ProtectedRoute>
              } />
              
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              } />
              
              {/* Strict Admin Route - Guarded and requires 'admin' role */}
              <Route path="/orders" element={
                <ProtectedRoute requiredRole="admin">
                  <Orders />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        
      </CartProvider>
    </AuthProvider>
  );
}

export default App;