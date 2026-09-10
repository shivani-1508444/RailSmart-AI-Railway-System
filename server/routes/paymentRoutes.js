const express = require('express');
const router = express.Router();
const { processPayment, getUserPayments } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/process', protect, processPayment);
router.get('/my', protect, getUserPayments);

module.exports = router;