const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

// ─── GET /api/vendors ────────────────────────────────────────
// Optional query param: ?vendorType=Food | Stationery | Print
// Example: GET /api/vendors?vendorType=Stationery
router.get('/', async (req, res) => {
  try {
    const filter = {};

    if (req.query.vendorType) {
      // Validate against allowed values before hitting the DB
      const allowed = ['Food', 'Stationery', 'Print'];
      if (!allowed.includes(req.query.vendorType)) {
        return res.status(400).json({
          message: `Invalid vendorType. Must be one of: ${allowed.join(', ')}`,
        });
      }
      filter.vendorType = req.query.vendorType;
    }

    const vendors = await Vendor.find(filter).sort({ createdAt: -1 });
    res.json(vendors);
  } catch (error) {
    console.error('Vendor Fetch Error:', error);
    res.status(500).json({ message: 'Failed to fetch vendors' });
  }
});

// ─── GET /api/vendors/:id ────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json(vendor);
  } catch (error) {
    // Catches malformed ObjectId strings (CastError) cleanly
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid vendor ID format' });
    }
    console.error('Vendor Detail Error:', error);
    res.status(500).json({ message: 'Failed to fetch vendor' });
  }
});

module.exports = router;
