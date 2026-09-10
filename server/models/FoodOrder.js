const mongoose = require('mongoose');

const FoodOrderItemSchema = new mongoose.Schema({
  foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true }
});

const FoodOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pnr: { type: String, required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  restaurantName: { type: String, required: true },
  deliveryStationCode: { type: String, required: true },
  deliveryStationName: { type: String, required: true },
  coachNumber: { type: String, required: true },
  seatNumber: { type: String, required: true },
  passengerName: { type: String, required: true },
  passengerPhone: { type: String, required: true },
  items: [FoodOrderItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['ORDER_PLACED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED_TO_SEAT', 'CANCELLED'], default: 'ORDER_PLACED' },
  paymentStatus: { type: String, enum: ['PAID', 'COD'], default: 'PAID' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FoodOrder', FoodOrderSchema);