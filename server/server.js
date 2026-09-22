const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const socketHandler = require('./socket/socketHandler');
const { startReminderScheduler } = require('./services/reminderService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static frontend build (for standalone local server mode)
if (!process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

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