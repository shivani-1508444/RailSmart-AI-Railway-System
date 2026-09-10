const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  isVeg: { type: Boolean, default: true },
  category: { type: String, enum: ['Thali', 'Biryani & Rice', 'Snacks & Beverages', 'Desserts', 'Breakfast', 'Fast Food', 'Starters', 'Mains'], default: 'Thali' },
  image: { type: String },
  isAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model('FoodItem', FoodItemSchema);