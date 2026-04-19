const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vendor name is required'],
      trim: true,
    },

    description: {
      type: String,
      default: '',
      trim: true,
    },

    vendorType: {
      type: String,
      required: [true, 'Vendor type is required'],
      enum: {
        values: ['Food', 'Stationery', 'Print'],
        message: 'vendorType must be Food, Stationery, or Print',
      },
    },

    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
    },

    isOpen: {
      type: Boolean,
      default: true,
    },

    location: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);
