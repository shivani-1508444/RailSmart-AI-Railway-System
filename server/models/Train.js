const mongoose = require('mongoose');

const RouteStopSchema = new mongoose.Schema({
  stationCode: { type: String, required: true },
  stationName: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  departureTime: { type: String, required: true },
  haltMinutes: { type: Number, default: 2 },
  dayCount: { type: Number, default: 1 },
  distanceKm: { type: Number, default: 0 },
  platform: { type: Number, default: 1 }
});

const ClassAvailabilitySchema = new mongoose.Schema({
  classCode: { type: String, enum: ['1A', '2A', '3A', '3E', 'SL', 'CC', 'EC', 'EA', '2S'], required: true },
  className: { type: String, required: true },
  baseFare: { type: Number, required: true },
  tatkalFare: { type: Number, required: true },
  totalSeats: { type: Number, default: 72 },
  availableSeats: { type: Number, default: 45 },
  status: { type: String, enum: ['AVAILABLE', 'RAC', 'WL', 'REGRET'], default: 'AVAILABLE' },
  racCount: { type: Number, default: 0 },
  wlCount: { type: Number, default: 0 },
  predictionConfidence: { type: Number, default: 95 }
});

const TrainSchema = new mongoose.Schema({
  trainNumber: { type: String, required: true, unique: true },
  trainName: { type: String, required: true },
  trainType: { type: String, enum: ['Vande Bharat', 'Rajdhani', 'Shatabdi', 'Tejas', 'Duronto', 'Superfast', 'Mail Express', 'Garib Rath'], default: 'Superfast' },
  fromStationCode: { type: String, required: true },
  fromStationName: { type: String, required: true },
  toStationCode: { type: String, required: true },
  toStationName: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  durationHours: { type: String, required: true },
  runningDays: [{ type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }],
  route: [RouteStopSchema],
  classes: [ClassAvailabilitySchema],
  pantryAvailable: { type: Boolean, default: true },
  cleanlinessRating: { type: Number, default: 4.6 },
  onTimeRating: { type: Number, default: 4.8 }
});

module.exports = mongoose.model('Train', TrainSchema);