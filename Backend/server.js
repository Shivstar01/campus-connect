'use strict';

require('dotenv').config();

const http           = require('http');
const express        = require('express');
const cors           = require('cors');
const mongoose       = require('mongoose');
const bcrypt         = require('bcryptjs');
const jwt            = require('jsonwebtoken');
const helmet         = require('helmet');
const rateLimit      = require('express-rate-limit');
const { Server }     = require('socket.io');

const Order    = require('./models/Order');
const User     = require('./models/User');
const MenuItem = require('./models/MenuItem');

const vendorRoutes  = require('./routes/vendorRoutes');
const productRoutes = require('./routes/productRoutes');

const { initPartySocket } = require('./socket/partySocket');

const app = express();

// ─── SECURITY MIDDLEWARE ──────────────────────────────────────

app.use(helmet());

// Manual NoSQL sanitizer — replaces express-mongo-sanitize which is broken on Express v5
app.use((req, res, next) => {
  if (req.body) {
    req.body = JSON.parse(JSON.stringify(req.body).replace(/\$|\./g, '_'));
  }
  next();
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to the MongoDB Vault!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only.' });
    }
    next();
  }); 
};

// ─── AUTH ROUTES ─────────────────────────────────────────────

app.post('/api/auth/signup', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required.' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });

    const role = email === 'admin@campus.com' ? 'admin' : 'student';
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists with this email' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ─── MENU ROUTES ─────────────────────────────────────────────

app.get('/api/menu', async (req, res) => {
  try {
    const items = await MenuItem.find({ isAvailable: true });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
});

app.post('/api/menu', verifyAdmin, async (req, res) => {
  try {
    const { name, price, category } = req.body;
    if (!name || !price || !category)
      return res.status(400).json({ message: 'name, price and category are required.' });
    const newItem = new MenuItem({ name, price, category });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create menu item' });
  }
});

// ─── ORDER ROUTES ─────────────────────────────────────────────

app.post('/api/orders', verifyToken, async (req, res) => {
  try {
    const { customerName, roomNumber, foodItems, orderTotal } = req.body;
    if (!customerName || !roomNumber || !foodItems || !orderTotal)
      return res.status(400).json({ success: false, message: 'Missing order fields.' });
    const newOrder = new Order({ customerName, roomNumber, foodItems, orderTotal });
    await newOrder.save();
    res.status(201).json({ success: true, message: 'Order securely saved to database!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save order' });
  }
});

app.get('/api/orders', verifyAdmin, async (req, res) => {
  try {
    const activeOrders = await Order.find({ status: 'New' });
    res.json(activeOrders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

app.put('/api/orders/:id', verifyAdmin, async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, { status: 'Completed' });
    res.json({ success: true, message: 'Order completed!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order' });
  }
});

// ─── SUPER-APP ROUTES ─────────────────────────────────────────

app.use('/api/vendors',  vendorRoutes);
app.use('/api/products', productRoutes);

// ─── ROOT ─────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.send('CampusConnect Backend is officially alive!');
});

// ─── HTTP SERVER + SOCKET.IO ──────────────────────────────────

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 20000,
  pingInterval: 25000,
  connectTimeout: 10000,
});

initPartySocket(io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Socket.io Party Mode LIVE on ws://localhost:${PORT}`);
});






