const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const Order = require('./models/Order');

const User = require('./models/User');

const app = express();

app.use(cors()); 
app.use(express.json()); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to the MongoDB Vault!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

  app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'student' 
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
});


app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    
    
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' } 
    );

    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

app.get('/', (req, res) => {
  res.send('CampusConnect Backend is officially alive!');
});


app.post('/api/orders', async (req, res) => {
  try {
    const incomingOrder = req.body; 

    
    const newOrder = new Order({
      customerName: incomingOrder.customerName,
      roomNumber: incomingOrder.roomNumber,
      foodItems: incomingOrder.foodItems,
      orderTotal: incomingOrder.orderTotal
    });

    
    await newOrder.save();

    res.status(201).json({ 
      success: true, 
      message: "Order securely saved to database!" 
    });

  } catch (error) {
   
    console.error("Database Save Error:", error);
    res.status(500).json({ success: false, message: "Failed to save order" });
  }
});


app.get('/api/orders', async (req, res) => {
  try {
    
    const activeOrders = await Order.find({ status: 'New' });
    res.json(activeOrders);
  } catch (error) {
    console.error("Database Read Error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    
    const orderId = req.params.id;

    
    await Order.findByIdAndUpdate(orderId, { status: 'Completed' });

    
    res.json({ success: true, message: "Order completed!" });
  } catch (error) {
    console.error("Database Update Error:", error);
    res.status(500).json({ message: "Failed to update order" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});