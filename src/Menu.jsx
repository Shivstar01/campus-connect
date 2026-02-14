import { useState, useContext } from 'react'; // 1. Import useContext
import { CartContext } from './CartContext'; // 2. Import the Brain
import {Link} from 'react-router-dom';


function Menu() {
  const [foodItems] = useState([
    { id: 1, name: "Veg Momos", price: "₹80", category: "Chinese" },
    { id: 2, name: "Masala Dosa", price: "₹120", category: "South Indian" },
    { id: 3, name: "Paneer Tikka Roll", price: "₹150", category: "Rolls" },
    { id: 4, name: "Chicken Biryani", price: "₹250", category: "Main Course" },
  ]);

  // 3. Get the "addToCart" function from the Global Brain
  const { addToCart } = useContext(CartContext); 

  return (
    <div style={{ padding: "20px" }}>
      <h1>🍔 Campus Menu</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
        
        {foodItems.map((item) => (
          <div key={item.id} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "10px" }}>
            <h3>{item.name}</h3>
            <p style={{ color: "gray" }}>{item.category}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "bold" }}>{item.price}</span>
              
              {/* 4. Connect the Button! */}
              <button 
                onClick={() => addToCart(item)} // <--- The Magic Line
                style={{ background: "green", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
              >
                Add +
              </button>
              <Link to="/orders">
        <button style={{ background: "blue", color: "white", padding: "10px", margin: "10px" }}>
          View Kitchen Orders
        </button>
      </Link>
              
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
}

export default Menu;