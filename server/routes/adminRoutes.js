const express = require('express');
const router = express.Router();
const { getAdminStats, saveTrain, deleteTrain, getAllUsers, getAllBookings } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/stats', protect, adminOnly, getAdminStats);
router.post('/trains', protect, adminOnly, saveTrain);
router.delete('/trains/:id', protect, adminOnly, deleteTrain);
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/bookings', protect, adminOnly, getAllBookings);

module.exports = router;