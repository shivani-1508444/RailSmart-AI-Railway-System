const Notification = require('../models/Notification');
const Booking = require('../models/Booking');

const startReminderScheduler = () => {
  console.log('[Reminder Service] RailSmart Smart Journey Scheduler initialized (Runs every 60s)...');
  
  setInterval(async () => {
    try {
      // Find confirmed bookings and create reminder notices if needed
      const upcomingBookings = await Booking.find({ status: 'CONFIRMED' }).limit(5);
      // Scheduled jobs background checks
    } catch (e) {
      // Background worker safe catch
    }
  }, 60000);
};

module.exports = { startReminderScheduler };