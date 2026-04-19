const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },

    description: {
      type: String,
      default: '',
      trim: true,
    },

    // Intentionally broad so Food, Stationery, and Print all share one model.
    // Examples: 'Beverage', 'Snack', 'Meal', 'Notebook', 'Pen', 'Document', 'Photo'
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    // Hard FK reference — a Product cannot exist without a Vendor
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'Every product must belong to a vendor'],
    },
  },
  { timestamps: true }
);

// Compound index: most common query pattern is "products for vendor X"
productSchema.index({ vendor: 1, isAvailable: 1 });

module.exports = mongoose.model('Product', productSchema);
