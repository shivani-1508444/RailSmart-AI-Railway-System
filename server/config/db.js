const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.warn('⚠️ MONGO_URI environment variable is missing.');
    if (process.env.VERCEL) {
      console.warn('Please add MONGO_URI in your Vercel Project Environment Variables.');
      return;
    }
  }

  const dbUri = uri || 'mongodb://127.0.0.1:27017/railsmart';

  try {
    const conn = await mongoose.connect(dbUri, {
      serverSelectionTimeoutMS: 5000
    });

    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Auto-seed if DB is empty
    try {
      const Train = require('../models/Train');
      const count = await Train.countDocuments();
      if (count === 0) {
        console.log('Database empty. Running auto-seeding...');
        const seedDatabase = require('../seed');
        await seedDatabase();
      }
    } catch (seedErr) {
      console.error('Auto-seed check notice:', seedErr.message);
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (!process.env.VERCEL) {
      // In non-vercel local env without MONGO_URI, log warning
    }
  }
};

module.exports = connectDB;