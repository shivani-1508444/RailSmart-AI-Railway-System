const mongoose = require('mongoose');

const PassengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'transgender', 'other'], default: 'male' },
  berthPreference: { type: String, enum: ['no_preference', 'lower', 'middle', 'upper', 'side_lower', 'side_upper', 'window'], default: 'no_preference' },
  foodPreference: { type: String, enum: ['veg', 'non_veg', 'jain', 'no_food'], default: 'veg' },
  seniorCitizen: { type: Boolean, default: false }
});

const SecurityLogSchema = new mongoose.Schema({
  device: { type: String, default: 'Desktop / Chrome' },
  browser: { type: String, default: 'Chrome 128.0' },
  ip: { type: String, default: '127.0.0.1' },
  location: { type: String, default: 'New Delhi, India' },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['success', 'suspicious', 'blocked'], default: 'success' }
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  savedPassengers: [PassengerSchema],
  favoritePNRs: [{ type: String }],
  securityLogs: [SecurityLogSchema],
  preferredLanguage: { type: String, enum: ['en', 'hi'], default: 'en' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);