const Payment = require('../models/Payment');

// @desc Mock Sandbox Payment Processing
// @route POST /api/payments/process
const processPayment = async (req, res) => {
  try {
    const { amount, paymentMethod, payerDetails } = req.body;
    const transactionId = `RS_TXN_${Date.now()}_${Math.floor(Math.random() * 89999 + 10000)}`;

    res.json({
      success: true,
      transactionId,
      amount,
      paymentMethod: paymentMethod || 'UPI',
      status: 'SUCCESS',
      message: 'Payment verified and captured via RailSmart Sandbox Gateway.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment processing error' });
  }
};

// @desc Get User Payment Receipts
// @route GET /api/payments/my
const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve payment history' });
  }
};

module.exports = { processPayment, getUserPayments };