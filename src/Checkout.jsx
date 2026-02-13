import { useState, useContext } from 'react';
import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout =()=>
{ 
    const [name ,setName] = useState("");
    const [room ,setRoom] =useState("");
    const {cart , clearCart} = useContext(CartContext);
    const navigate = useNavigate();
    const handlePlaceOrder =()=>{
        if(name===""|| room ===""){
        alert("Please Enter your name and room number");
        return;
    }

    alert(`Order placed successfully for ${name} to Room ${room}`);

    clearCart();

    navigate('/'); 
}
    
    return(
    <div style ={{padding :"20px"}}>
        <h1>Checkout</h1>
        <input type="text"
        placeholder='Your Name'
        value={name}
        onChange={(e)=>setName(e.target.value)} />
        
        <input type="text" 
        placeholder='Hostel Room Number'
        value={room}
        onChange={(e)=>setRoom(e.target.value)}/>

        <button onClick={handlePlaceOrder}
        style={{background:"black" ,color:"white", padding:"10px", marginTop:"10px",cursor:"pointer"}}>Place Order</button>
    </div>
);

};

export default Checkout;

