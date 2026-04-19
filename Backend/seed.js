require('dotenv').config();
const mongoose = require('mongoose');

const Vendor  = require('./models/Vendor');
const Product = require('./models/Product');
const MenuItem = require('./models/MenuItem'); // kept so we can wipe old data cleanly

// ─── Seed Data ────────────────────────────────────────────────

const vendors = [
  {
    name: 'Hostel Mess',
    description: 'Your daily dose of home-style campus food. Hot meals, chai & snacks all day.',
    vendorType: 'Food',
    rating: 4.2,
    isOpen: true,
    location: 'Hostel Block A, Ground Floor',
  },
  {
    name: 'Campus Needs',
    description: 'Everything you forgot to pack. Stationery, printing supplies & more.',
    vendorType: 'Stationery',
    rating: 4.5,
    isOpen: true,
    location: 'Main Academic Block, Room 4',
  },
  {
    name: 'Main Block Xerox',
    description: 'Fast & affordable printing, scanning and binding. B&W and colour.',
    vendorType: 'Print',
    rating: 4.3,
    isOpen: true,
    location: 'Main Block, Near Library Entrance',
  },
];

// Products are defined as functions that receive the created vendor IDs
const buildProducts = ({ messId, stationeryId, printId }) => [

  // ── Food (Hostel Mess) ───────────────────────────────────────
  {
    name: 'Hostel Maggi',
    price: 40,
    description: 'Classic two-minute noodles with a secret mess masala.',
    category: 'Snack',
    isAvailable: true,
    vendor: messId,
  },
  {
    name: 'Chicken Biryani',
    price: 150,
    description: 'Friday special — slow-cooked, aromatic and worth the wait.',
    category: 'Meal',
    isAvailable: true,
    vendor: messId,
  },
  {
    name: 'Kulhad Chai',
    price: 20,
    description: 'Served in an earthen cup. The real campus experience.',
    category: 'Beverage',
    isAvailable: true,
    vendor: messId,
  },

  // ── Stationery (Campus Needs) ────────────────────────────────
  {
    name: 'A4 Notebook (200 pages)',
    price: 65,
    description: 'Ruled, hardcover. Fits every subject.',
    category: 'Notebook',
    isAvailable: true,
    vendor: stationeryId,
  },
  {
    name: 'Blue Pens (Pack of 10)',
    price: 35,
    description: 'Smooth-writing ballpoint pens. Exam-approved.',
    category: 'Pen',
    isAvailable: true,
    vendor: stationeryId,
  },
  {
    name: 'Scientific Calculator',
    price: 320,
    description: 'All engineering & science exams covered.',
    category: 'Electronics',
    isAvailable: true,
    vendor: stationeryId,
  },

  // ── Print (Main Block Xerox) ─────────────────────────────────
  {
    name: 'B&W Printout (Per Page)',
    price: 2,
    description: 'Standard A4, 80gsm paper. Fast turnaround.',
    category: 'Document',
    isAvailable: true,
    vendor: printId,
  },
  {
    name: 'Colour Printout (Per Page)',
    price: 10,
    description: 'Vibrant colour prints on A4. Great for presentations.',
    category: 'Document',
    isAvailable: true,
    vendor: printId,
  },
  {
    name: 'Spiral Binding',
    price: 40,
    description: 'Up to 100 pages. Includes front & back cover.',
    category: 'Binding',
    isAvailable: true,
    vendor: printId,
  },
];

// ─── Main Seed Function ───────────────────────────────────────

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅  Connected to MongoDB');

    // 1. Wipe old collections (MenuItem is the legacy flat table)
    await Promise.all([
      Vendor.deleteMany({}),
      Product.deleteMany({}),
      MenuItem.deleteMany({}),
    ]);
    console.log('🗑️   Cleared Vendors, Products, and legacy MenuItems');

    // 2. Insert vendors and capture their generated _ids
    const [mess, stationery, print] = await Vendor.insertMany(vendors);
    console.log(`🏪  Created 3 vendors: "${mess.name}", "${stationery.name}", "${print.name}"`);

    // 3. Build and insert products with real vendor ObjectId references
    const products = buildProducts({
      messId:       mess._id,
      stationeryId: stationery._id,
      printId:      print._id,
    });

    await Product.insertMany(products);
    console.log(`📦  Created ${products.length} products across 3 vendors`);

    console.log('\n🎉  Seed complete! Your Campus Super-App database is ready.\n');
  } catch (error) {
    console.error('❌  Seeding error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌  MongoDB connection closed');
  }
};

seedDB();
