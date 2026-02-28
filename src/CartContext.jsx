import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('campusCart');
    return savedCart ? JSON.parse(savedCart) : []; 
  });

  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('campusOrders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  
  useEffect(() => {
    localStorage.setItem('campusCart', JSON.stringify(cart));
  }, [cart]);

  
  useEffect(() => {
    localStorage.setItem('campusOrders', JSON.stringify(orders));
  }, [orders]);

  
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