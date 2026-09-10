const mongoose = require('mongoose');

const BookedPassengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  berthPreference: { type: String, default: 'no_preference' },
  allocatedCoach: { type: String, default: 'B1' },
  allocatedBerth: { type: Number, default: 23 },
  allocatedBerthType: { type: String, default: 'LOWER' },
  currentStatus: { type: String, enum: ['CNF', 'RAC', 'WL'], default: 'CNF' },
  statusDetails: { type: String, default: 'Confirmed' }
});

const BookingSchema = new mongoose.Schema({
  pnr: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Train', required: true },
  trainNumber: { type: String, required: true },
  trainName: { type: String, required: true },
  fromStation: { type: String, required: true },
  toStation: { type: String, required: true },
  fromStationName: { type: String },
  toStationName: { type: String },
  journeyDate: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  travelClass: { type: String, required: true },
  quota: { type: String, enum: ['GENERAL', 'TATKAL', 'LADIES', 'SENIOR_CITIZEN'], default: 'GENERAL' },
  passengers: [BookedPassengerSchema],
  fareBreakdown: {
    baseFare: { type: Number, required: true },
    reservationFee: { type: Number, default: 40 },
    superfastFee: { type: Number, default: 45 },
    cateringFee: { type: Number, default: 0 },
    gst: { type: Number, default: 50 },
    totalFare: { type: Number, required: true }
  },
  status: { type: String, enum: ['CONFIRMED', 'WAITLISTED', 'RAC', 'CANCELLED'], default: 'CONFIRMED' },
  chartPrepared: { type: Boolean, default: false },
  qrToken: { type: String, required: true },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  cancellationDetails: {
    cancelledAt: { type: Date },
    refundAmount: { type: Number },
    refundStatus: { type: String, enum: ['PENDING', 'PROCESSED', 'FAILED'], default: 'PENDING' },
    refundRef: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);