const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stationCode: { type: String, required: true },
  stationName: { type: String, required: true },
  cuisine: [{ type: String }],
  rating: { type: Number, default: 4.5 },
  deliveryMinutes: { type: Number, default: 20 },
  minOrder: { type: Number, default: 100 },
  image: { type: String },
  isOpen: { type: Boolean, default: true }
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);