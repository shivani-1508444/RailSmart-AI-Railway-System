const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, savePassenger, deletePassenger } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.post('/passengers', protect, savePassenger);
router.delete('/passengers/:passengerId', protect, deletePassenger);

module.exports = router;