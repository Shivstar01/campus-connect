const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// ─── GET /api/products ───────────────────────────────────────
// Optional query params:
//   ?vendorId=<ObjectId>   → fetch catalog for a specific vendor
//   ?category=Beverage     → filter by category (can combine with vendorId)
//
// Examples:
//   GET /api/products?vendorId=64abc123...
//   GET /api/products?vendorId=64abc123...&category=Snack
//   GET /api/products                          (returns all available products)
router.get('/', async (req, res) => {
  try {
    const filter = { isAvailable: true };

    if (req.query.vendorId) {
      filter.vendor = req.query.vendorId;
    }

    if (req.query.category) {
      // Case-insensitive category match
      filter.category = { $regex: new RegExp(`^${req.query.category}$`, 'i') };
    }

    // Populate the vendor name + type so the frontend never needs a second request
    const products = await Product.find(filter)
      .populate('vendor', 'name vendorType location isOpen')
      .sort({ createdAt: 1 });

    res.json(products);
  } catch (error) {
    console.error('Product Fetch Error:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// ─── GET /api/products/:id ───────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'vendor',
      'name vendorType location isOpen'
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    console.error('Product Detail Error:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

module.exports = router;
