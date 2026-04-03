require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'NOT FOUND');

const menuItems = [
  { name: "Hostel Maggi", price: 40, category: "Snacks" },
  { name: "Chicken Biryani", price: 150, category: "Meals" },
  { name: "Kulhad Chai", price: 20, category: "Drinks" },
  { name: "Paneer Roll", price: 80, category: "Snacks" },
  { name: "Cold Coffee", price: 60, category: "Drinks" },
  { name: "Veg Thali", price: 120, category: "Meals" }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');

    await MenuItem.insertMany(menuItems);
    console.log('Menu items seeded successfully!');

    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

seedDB();