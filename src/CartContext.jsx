import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  
  // 1. INITIALIZATION: Instead of starting empty, check the browser's hard drive first!
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('campusCart');
    return savedCart ? JSON.parse(savedCart) : []; // If data exists, parse it. If not, empty array.
  });

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('campusOrders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // 2. THE WATCHERS: Every time 'cart' changes, save the new version to localStorage
  useEffect(() => {
    localStorage.setItem('campusCart', JSON.stringify(cart));
  }, [cart]);

  // Every time 'orders' change, save the new version to localStorage
  useEffect(() => {
    localStorage.setItem('campusOrders', JSON.stringify(orders));
  }, [orders]);

  // 3. THE FUNCTIONS (These stay exactly the same!)
  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const clearCart = () => {
    setCart([]);
  };

  const addOrder = (newOrder) => {
    setOrders((prevOrders) => [...prevOrders, newOrder]);
  };

  return (
    <CartContext.Provider value={{ cart, orders, addToCart, clearCart, addOrder }}>
      {children}
    </CartContext.Provider>
  );
};