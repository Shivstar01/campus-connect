const mongoose = require('mongoose');

// Define the structure for a user in the database
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Prevents two people from signing up with the same email
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin'], // The user must be one of these two roles
    default: 'student' // If not specified, they are a normal student
  }
}, { 
  // This automatically adds createdAt and updatedAt timestamps
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);