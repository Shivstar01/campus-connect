import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Menu from './Menu';
import Cart from './Cart'; // <--- 1. Import Cart

import { useContext } from 'react';
import { CartContext } from './CartContext';

function CartIcon() {
  const { cart } = useContext(CartContext);
  return (
    // 3. Make the "Cart "  text clickable
    <Link to="/cart" style={{ fontWeight: "bold", textDecoration: "none", color: "black" }}>
       🛒 Cart: {cart.length}
    </Link>
  );
}

//test

function App() {
  return (
    <div className="app">
      <nav style={{ padding: 20, borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between" }}>
        <div>
          <Link to="/" style={{ marginRight: 20 }}>Home</Link>
          <Link to="/menu">Food Menu</Link>
        </div>
        <CartIcon />
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} /> {/* <--- 2. Add Route */}
      </Routes>
    </div>
  );
}

export default App;