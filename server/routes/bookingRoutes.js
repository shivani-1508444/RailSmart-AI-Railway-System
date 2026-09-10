const express = require('express');
const router = express.Router();
const { createBooking, getPNRStatus, getUserBookings, cancelBooking, getRefundStatus } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getUserBookings);
router.get('/pnr/:pnr', getPNRStatus);
router.post('/:id/cancel', protect, cancelBooking);
router.get('/refunds/:pnr', getRefundStatus);

module.exports = router;