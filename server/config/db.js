const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { execSync } = require('child_process');
const path = require('path');

let mongoServer;

const connectDB = async () => {
  try {
    const envUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/railsmart';
    let uri = envUri;
    let isMemory = false;
    
    // Start in-memory DB if URI is localhost
    if (envUri.includes('127.0.0.1') || envUri.includes('localhost')) {
      console.log('Starting in-memory MongoDB Server for local testing...');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      process.env.MONGO_URI = uri; // For seed.js
      isMemory = true;
      console.log(`In-memory MongoDB started at ${uri}`);
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    if (isMemory) {
        console.log('Seeding in-memory database... this may take a moment.');
        try {
            execSync(`node "${path.join(__dirname, '../seed.js')}"`, { stdio: 'inherit' });
            console.log('Seeding finished.');
        } catch(err) {
            console.error('Seeding failed:', err.message);
        }
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;