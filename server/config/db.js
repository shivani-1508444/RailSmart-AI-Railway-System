const mongoose = require('mongoose');

let isConnected = false;
let memoryServer = null;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/railsmart';

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2500
    });

    isConnected = true;
    console.log(`MongoDB Connected (Primary): ${conn.connection.host}`);
    await checkAndSeed();
    return;
  } catch (primaryErr) {
    console.warn(`Primary MongoDB notice (${primaryErr.message}). Launching In-Memory Engine Fallback...`);
  }

  // Fallback to In-Memory MongoDB Engine so DB NEVER fails or crashes
  try {
    if (!memoryServer) {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
    }
    const memUri = memoryServer.getUri();
    const conn = await mongoose.connect(memUri);
    isConnected = true;
    console.log(`✅ In-Memory MongoDB Engine Connected Successfully: ${conn.connection.host}`);
    await checkAndSeed();
  } catch (memErr) {
    console.error('Failed to start In-Memory MongoDB:', memErr.message);
  }
};

const checkAndSeed = async () => {
  try {
    const Train = require('../models/Train');
    const count = await Train.countDocuments();
    if (count === 0) {
      console.log('Database empty. Auto-seeding initial dataset...');
      const seedDatabase = require('../seed');
      await seedDatabase();
    }
  } catch (seedErr) {
    console.error('Auto-seed notice:', seedErr.message);
  }
};

module.exports = connectDB;