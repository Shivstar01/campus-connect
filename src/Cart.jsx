import { useContext } from "react";
import { CartContext } from "./CartContext";

function Cart() {
  const { cart } = useContext(CartContext);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🛒 Your Cart</h1>
      
      {cart.length === 0 ? (
        <p>Your cart is empty. Go eat something!</p>
      ) : (
        cart.map((item, index) => (
          <div key={index} style={{ borderBottom: "1px solid #ccc", padding: "10px", display: "flex", justifyContent: "space-between" }}>
            <span>{item.name}</span>
            <span style={{ fontWeight: "bold" }}>{item.price}</span>
          </div>
        ))
      )}
    </div>
  );
}

export default Cart;