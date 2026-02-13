import { createContext, useState } from "react";

// 1. Create the Context (The "Radio Station")
export const CartContext = createContext();

// 2. Create the Provider (The "Broadcast Tower")
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // This state lives globally!

  // Function to add item to cart
  const addToCart = (item) => {
    setCart([...cart, item]); };// Add new item to existing list

    const clearCart =()=>{
      setCart([]);
    };
  

  return (
    <CartContext.Provider value={{ cart, addToCart ,clearCart }}>
      {children}
    </CartContext.Provider>
  );
};