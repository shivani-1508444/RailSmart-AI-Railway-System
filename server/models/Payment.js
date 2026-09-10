const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pnr: { type: String },
  transactionId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  paymentMethod: { type: String, enum: ['UPI', 'DEBIT_CARD', 'CREDIT_CARD', 'NET_BANKING', 'WALLET'], default: 'UPI' },
  status: { type: String, enum: ['SUCCESS', 'FAILED', 'REFUNDED'], default: 'SUCCESS' },
  gateway: { type: String, default: 'RAILSMART_SANDBOX_GATEWAY' },
  payerDetails: {
    vpa: { type: String },
    cardLast4: { type: String },
    bankName: { type: String }
  },
  receiptUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);