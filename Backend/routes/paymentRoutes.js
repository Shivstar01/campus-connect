// Backend/routes/paymentRoutes.js
// ─────────────────────────────────────────────────────────────
// npm install razorpay   ← run this inside your /Backend folder
// ─────────────────────────────────────────────────────────────

const express = require('express');
const router  = express.Router();
const Razorpay = require('razorpay');
const crypto   = require('crypto');   // built-in Node module, no install needed

// ── Razorpay instance ──────────────────────────────────────────
// Reads RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET from your .env file.
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── POST /api/payments/create-order ───────────────────────────
// Body: { amount: <number in rupees> }
// Returns: { orderId, amount, currency }
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'A valid amount (in ₹) is required.' });
    }

    // Razorpay expects the amount in **paise** (1 ₹ = 100 paise).
    const options = {
      amount:   Math.round(amount * 100),
      currency: 'INR',
      receipt:  `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      orderId:  order.id,        // e.g. "order_OHkNyDh6KEYbLX"
      amount:   order.amount,    // in paise – sent back so frontend doesn't re-calculate
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({ message: 'Failed to create Razorpay order.' });
  }
});

// ── POST /api/payments/verify ─────────────────────────────────
// Called by the frontend AFTER Razorpay closes successfully.
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
router.post('/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment fields.' });
    }

    // Razorpay signature = HMAC-SHA256( order_id + "|" + payment_id, key_secret )
    const body      = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isAuthentic = expected === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: 'Payment signature is invalid.' });
    }

    // ── Signature is valid ──────────────────────────────────────
    // TODO (optional): persist the payment_id to your Order document here, e.g.
    //   await Order.findOneAndUpdate(
    //     { razorpayOrderId: razorpay_order_id },
    //     { paymentId: razorpay_payment_id, paymentStatus: 'paid' }
    //   );

    res.json({ success: true, paymentId: razorpay_payment_id });

  } catch (error) {
    console.error('Razorpay Verify Error:', error);
    res.status(500).json({ success: false, message: 'Signature verification failed.' });
  }
});

module.exports = router;
