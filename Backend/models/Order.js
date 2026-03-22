const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
  customerName: { 
    type: String, 
    required: true 
  },
  roomNumber: { 
    type: String, 
    required: true 
  },
  foodItems: { 
    type: Array, 
    required: true 
  },
  orderTotal: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'preparing', 'ready'],
    default: 'pending'
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'    
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});


module.exports = mongoose.model('Order', orderSchema);