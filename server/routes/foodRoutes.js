const express = require('express');
const router = express.Router();
const { getRestaurants, getRestaurantMenu, placeFoodOrder, trackFoodOrder, getUserFoodOrders } = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');

router.get('/restaurants', getRestaurants);
router.get('/restaurants/:id/menu', getRestaurantMenu);
router.post('/orders', protect, placeFoodOrder);
router.get('/orders/my', protect, getUserFoodOrders);
router.get('/orders/:id', trackFoodOrder);

module.exports = router;