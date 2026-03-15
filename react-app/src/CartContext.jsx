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

  
  const addToCart = (itemToAdd) => {
    setCart((prevCart) => {
      
      const existingItemIndex = prevCart.findIndex(item => item._id === itemToAdd._id);
      
      if (existingItemIndex >= 0) {
       
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
       
        return [...prevCart, { ...itemToAdd, quantity: 1 }];
      }
    });
  };

  
  const updateQuantity = (index, delta) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const newQuantity = updatedCart[index].quantity + delta;
      
      if (newQuantity <= 0) {
        
        updatedCart.splice(index, 1);
      } else {
        updatedCart[index].quantity = newQuantity;
      }
      return updatedCart;
    });
  };

  
  const removeFromCart = (index) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      updatedCart.splice(index, 1);
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const addOrder = (newOrder) => {
    setOrders((prevOrders) => [...prevOrders, newOrder]);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      orders, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart, 
      addOrder 
    }}>
      {children}
    </CartContext.Provider>
  );
};