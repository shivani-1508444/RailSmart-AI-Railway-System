const mongoose = require('mongoose');

const StationSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zone: { type: String, default: 'NR' },
  platforms: { type: Number, default: 8 },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
});

module.exports = mongoose.model('Station', StationSchema);