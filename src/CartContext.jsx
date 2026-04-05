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
     
      const existingItemIndex = prevCart.findIndex(
        (item) => item._id === itemToAdd._id
      );
      
      if (existingItemIndex >= 0) {
        return prevCart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...itemToAdd, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (index, delta) => {
  setCart((prevCart) => {
    const newQuantity = prevCart[index].quantity + delta;
    if (newQuantity <= 0) {
      return prevCart.filter((_, i) => i !== index);
    }
    return prevCart.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity } : item
    );
  });
};
  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

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