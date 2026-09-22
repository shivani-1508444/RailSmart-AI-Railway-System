const Notification = require('../models/Notification');
const Booking = require('../models/Booking');

const startReminderScheduler = () => {
  console.log('[Reminder Service] RailSmart Smart Journey Scheduler initialized (Runs every 60s)...');

  const checkReminders = async () => {
    try {
      // Find confirmed bookings and create reminder notices if needed
      const upcomingBookings = await Booking.find({ status: 'CONFIRMED' }).limit(200);
      const now = new Date();

      for (const booking of upcomingBookings) {
        const journeyDateTime = new Date(booking.journeyDate);
        const hoursToDeparture = (journeyDateTime - now) / (1000 * 60 * 60);

        // Send a reminder once the journey is within the next 48 hours
        if (hoursToDeparture > 0 && hoursToDeparture <= 48) {
          const alreadySent = await Notification.findOne({
            userId: booking.userId,
            type: 'JOURNEY_REMINDER',
            'metadata.bookingId': booking._id.toString()
          });

          if (!alreadySent) {
            await Notification.create({
              userId: booking.userId,
              type: 'JOURNEY_REMINDER',
              title: `Upcoming Journey: ${booking.trainName} (#${booking.trainNumber})`,
              message: `Your train departs from ${booking.fromStation} at ${booking.departureTime} on ${booking.journeyDate}. PNR: ${booking.pnr}. Please reach the station at least 30 minutes early.`,
              metadata: { bookingId: booking._id.toString(), pnr: booking.pnr }
            });
          }
        }
      }
    } catch (e) {
      console.error('[Reminder Service] Error while generating journey reminders:', e.message);
    }
  };

  // Run immediately on start, then every 60s
  checkReminders();
  setInterval(checkReminders, 60000);
};

module.exports = { startReminderScheduler };