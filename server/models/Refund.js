const mongoose = require('mongoose');

const RefundSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pnr: { type: String, required: true },
  totalPaid: { type: Number, required: true },
  cancellationCharges: { type: Number, required: true },
  refundAmount: { type: Number, required: true },
  status: { type: String, enum: ['INITIATED', 'VERIFIED_BY_RAILSMART', 'CREDITED_TO_SOURCE'], default: 'INITIATED' },
  refundRef: { type: String, required: true },
  timeline: [
    {
      stage: { type: String, required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Refund', RefundSchema);