import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { CartProvider } from './CartContext';
import { AuthProvider, AuthContext } from './AuthContext';
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
import ProtectedRoute from './ProtectedRoute';

function LogoutButton() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <button
      onClick={handleLogout}
      style={{ fontWeight: "bold", cursor: "pointer", background: "none", border: "none", color: "red" }}
    >
      Logout
    </button>
  );
}

function CartIcon() {
  const { cart } = useContext(CartContext);
  return (
    <Link to="/cart" style={{ fontWeight: "bold", textDecoration: "none", color: "black" }}>
      🛒 Cart: {cart.reduce((sum, item) => sum + item.quantity, 0)}
    </Link>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app">
          <nav style={{ padding: 20, borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Link to="/" style={{ marginRight: 20 }}>Home</Link>
              <Link to="/menu">Food Menu</Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <CartIcon />
              <LogoutButton />
            </div>
          </nav>

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/supplier/login" element={<SupplierLogin />} />

            {/* Protected Routes */}
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

            {/* Admin Only Route */}
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