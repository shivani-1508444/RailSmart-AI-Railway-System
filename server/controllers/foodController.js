const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');
const FoodOrder = require('../models/FoodOrder');
const Notification = require('../models/Notification');

// @desc Get Restaurants by Station Code
// @route GET /api/food/restaurants
const getRestaurants = async (req, res) => {
  try {
    const { station } = req.query;
    let query = {};
    if (station) {
      query = { stationCode: station.toUpperCase() };
    }
    let restaurants = await Restaurant.find(query);
    if (restaurants.length === 0) {
      restaurants = await Restaurant.find({});
    }
    res.json({ success: true, restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load restaurants' });
  }
};

// @desc Get Food Items for a Restaurant
// @route GET /api/food/restaurants/:id/menu
const getRestaurantMenu = async (req, res) => {
  try {
    const items = await FoodItem.find({ restaurantId: req.params.id, isAvailable: true });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load menu items' });
  }
};

// @desc Place e-Catering Food Order
// @route POST /api/food/orders
const placeFoodOrder = async (req, res) => {
  try {
    const { pnr, restaurantId, deliveryStationCode, deliveryStationName, coachNumber, seatNumber, passengerName, passengerPhone, items, totalAmount } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    const orderId = `FD_${Date.now()}_${Math.floor(Math.random() * 899 + 100)}`;

    const order = await FoodOrder.create({
      orderId,
      userId: req.user._id,
      pnr,
      restaurantId,
      restaurantName: restaurant ? restaurant.name : 'IRCTC Food Partner',
      deliveryStationCode,
      deliveryStationName,
      coachNumber,
      seatNumber,
      passengerName,
      passengerPhone,
      items,
      totalAmount,
      status: 'ORDER_PLACED'
    });

    await Notification.create({
      userId: req.user._id,
      type: 'FOOD_UPDATE',
      title: `🍱 Meal Order Confirmed (${orderId})`,
      message: `Your meal from ${restaurant?.name || 'Restaurant'} will be delivered at ${deliveryStationName} to Coach ${coachNumber}, Seat ${seatNumber}.`
    });

    res.status(201).json({ success: true, message: 'Food order placed successfully!', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to place food order' });
  }
};

// @desc Track Food Order
// @route GET /api/food/orders/:id
const trackFoodOrder = async (req, res) => {
  try {
    const order = await FoodOrder.findOne({ $or: [{ orderId: req.params.id }, { _id: req.params.id }] });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Food order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error tracking food order' });
  }
};

// @desc Get User's Food Orders
// @route GET /api/food/orders/my
const getUserFoodOrders = async (req, res) => {
  try {
    const orders = await FoodOrder.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch food orders' });
  }
};

module.exports = { getRestaurants, getRestaurantMenu, placeFoodOrder, trackFoodOrder, getUserFoodOrders };