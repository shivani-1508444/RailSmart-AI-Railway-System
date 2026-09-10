const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'railsmart_super_secure_jwt_secret_key_2026', {
    expiresIn: '30d'
  });
};

// @desc Register User
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      securityLogs: [{
        device: req.headers['user-agent']?.includes('Mobile') ? 'Mobile' : 'Desktop',
        browser: 'Web Browser',
        ip: req.ip || '127.0.0.1',
        location: 'New Delhi, India',
        status: 'success'
      }]
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        savedPassengers: user.savedPassengers
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc Login User
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Append security log
    user.securityLogs.push({
      device: req.headers['user-agent']?.includes('Mobile') ? 'Mobile Device' : 'Desktop / PC',
      browser: 'Web Browser',
      ip: req.ip || '127.0.0.1',
      location: 'India',
      status: 'success',
      timestamp: new Date()
    });
    if (user.securityLogs.length > 20) user.securityLogs.shift();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        savedPassengers: user.savedPassengers,
        securityLogs: user.securityLogs
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc Get Current Profile
// @route GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
  }
};

// @desc Add or Update Saved Passenger
// @route POST /api/auth/passengers
const savePassenger = async (req, res) => {
  try {
    const { name, age, gender, berthPreference, foodPreference, seniorCitizen } = req.body;
    const user = await User.findById(req.user._id);

    user.savedPassengers.push({
      name,
      age: parseInt(age, 10),
      gender,
      berthPreference: berthPreference || 'no_preference',
      foodPreference: foodPreference || 'veg',
      seniorCitizen: Boolean(seniorCitizen)
    });

    await user.save();
    res.json({ success: true, savedPassengers: user.savedPassengers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save passenger profile' });
  }
};

// @desc Delete Saved Passenger
// @route DELETE /api/auth/passengers/:passengerId
const deletePassenger = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedPassengers = user.savedPassengers.filter(p => p._id.toString() !== req.params.passengerId);
    await user.save();
    res.json({ success: true, savedPassengers: user.savedPassengers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete passenger' });
  }
};

module.exports = { registerUser, loginUser, getProfile, savePassenger, deletePassenger };