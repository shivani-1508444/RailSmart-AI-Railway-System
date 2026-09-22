const mongoose = require('mongoose');

let isConnected = false;
let memoryServer = null;

// Disable Mongoose buffering so un-connected DB queries fail fast instead of hanging HTTP requests
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/railsmart';

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000
    });

    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await checkAndSeed();
    return;
  } catch (primaryErr) {
    console.warn(`Primary MongoDB Notice: ${primaryErr.message}`);
  }

  // Fallback to In-Memory MongoDB engine if available
  try {
    if (!memoryServer) {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create({
        instance: { dbName: 'railsmart' }
      });
    }
    const memUri = memoryServer.getUri();
    const conn = await mongoose.connect(memUri);
    isConnected = true;
    console.log(`✅ In-Memory MongoDB Engine Connected Successfully: ${conn.connection.host}`);
    await checkAndSeed();
  } catch (memErr) {
    console.warn('In-Memory MongoDB Notice:', memErr.message);
  }
};

const checkAndSeed = async () => {
  if (mongoose.connection.readyState !== 1) return;
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