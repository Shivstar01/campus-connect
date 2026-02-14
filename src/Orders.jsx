import {useContext} from 'react';
import { CartContext } from './CartContext';

const Orders =()=>{
    const{orders}=useContext(CartContext);

   

    return (
    <div style={{ padding: "20px" }}>
      <h1>Kitchen Orders</h1>
      
      {/* If the vault is empty, show a message */}
      {orders.length === 0 ? (
        <p>No orders yet. The kitchen is empty!</p>
      ) : (
        /* If there are orders, loop through them and draw a card for each */
        orders.map((order, index) => (
          <div key={index} style={{ border: "1px solid black", padding: "10px", marginBottom: "10px" }}>
            <h3>Order #{index + 1} - {order.customerName} (Room {order.roomNumber})</h3>
            <p>Total: ₹{order.orderTotal}</p>
            <p>Items: {order.foodItems.length}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;