const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// .env dhundho: pehle project root me, phir server folder me
const envCandidates = [
  path.join(__dirname, '../.env'),
  path.join(__dirname, '.env')
];
const envPath = envCandidates.find((p) => fs.existsSync(p));

if (envPath) {
  const result = dotenv.config({ path: envPath, override: true });
  console.log('[ENV] Loaded .env from:', envPath, '| error:', result.error ? result.error.message : 'none');
} else {
  console.log('[ENV] .env file NOT FOUND in project root or server/');
}
// Debug line (password print nahi hota). Kaam ho jaye to hata dena.
console.log('[ENV] URI host:', (process.env.MONGO_URI || 'NOT SET').split('@').pop());

const connectDB = require('./config/db');
const socketHandler = require('./socket/socketHandler');
const { startReminderScheduler } = require('./services/reminderService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Database auto-connect middleware (crucial for Vercel serverless functions & Render)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection notice:', err.message);
    next();
  }
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trains', require('./routes/trainRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.get('/api/pnr/:pnr', require('./controllers/bookingController').getPNRStatus);
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/food', require('./routes/foodRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// System Health API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'RailSmart - AI-Powered Railway Travel Management System',
    timestamp: new Date()
  });
});

// Serve frontend for all SPA routes (for standalone local server mode)
if (!process.env.VERCEL) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  const server = http.createServer(app);
  socketHandler(server);

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`RailSmart Server running on http://0.0.0.0:${PORT}`);
    console.log(`RailSmart System Health at http://0.0.0.0:${PORT}/api/health`);

    // Connect to Database asynchronously in background
    connectDB().then(() => {
      startReminderScheduler();
    }).catch((err) => {
      console.error('Database initialization notice:', err.message);
    });
  });
}