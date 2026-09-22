const mongoose = require('mongoose');

let isConnected = false;
let memoryServer = null;

// Disable Mongoose command buffering so queries don't hang HTTP requests
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  // 1. If user provided a Cloud MONGO_URI in process.env, try it
  if (process.env.MONGO_URI) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 4000
      });
      isConnected = true;
      console.log(`MongoDB Connected (Cloud URI): ${conn.connection.host}`);
      await checkAndSeed();
      return;
    } catch (cloudErr) {
      console.warn(`Cloud MONGO_URI Connection Notice: ${cloudErr.message}`);
    }
  }

  // 2. Try Local MongoDB daemon if running
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/railsmart', {
      serverSelectionTimeoutMS: 1500
    });
    isConnected = true;
    console.log(`MongoDB Connected (Local): ${conn.connection.host}`);
    await checkAndSeed();
    return;
  } catch (localErr) {
    // Local MongoDB daemon not running, proceed to in-memory engine
  }

  // 3. Automated In-Memory MongoDB Engine (Zero-Config Database for Render & Local)
  try {
    console.log('⚡ Launching Zero-Config In-Memory MongoDB Engine...');
    if (!memoryServer) {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create({
        instance: { dbName: 'railsmart' }
      });
    }
    const memUri = memoryServer.getUri();
    const conn = await mongoose.connect(memUri);
    isConnected = true;
    console.log(`✅ Zero-Config In-Memory MongoDB Connected: ${conn.connection.host}`);
    await checkAndSeed();
  } catch (memErr) {
    console.error('In-Memory DB Notice:', memErr.message);
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