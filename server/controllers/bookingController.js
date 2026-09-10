const Booking = require('../models/Booking');
const Train = require('../models/Train');
const Payment = require('../models/Payment');
const Refund = require('../models/Refund');
const Notification = require('../models/Notification');

// Generate Unique 10-Digit Indian Railways PNR
const generateUniquePNR = () => {
  const prefix = Math.floor(200 + Math.random() * 700); // e.g. 245, 458, 672
  const suffix = Math.floor(1000000 + Math.random() * 9000000);
  return `${prefix}${suffix}`.slice(0, 10);
};

// @desc Create New Ticket Booking
// @route POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { trainId, journeyDate, travelClass, quota, passengers, paymentMethod } = req.body;

    if (!trainId || !journeyDate || !travelClass || !passengers || passengers.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide all booking details' });
    }

    const train = await Train.findById(trainId);
    if (!train) {
      return res.status(404).json({ success: false, message: 'Train not found' });
    }

    // Find class fare
    const classObj = train.classes.find(c => c.classCode === travelClass) || train.classes[0];
    const baseRate = quota === 'TATKAL' ? classObj.tatkalFare : classObj.baseFare;

    const baseFareTotal = baseRate * passengers.length;
    const reservationFee = 40 * passengers.length;
    const superfastFee = 45;
    const gst = Math.round(baseFareTotal * 0.05);
    const totalFare = baseFareTotal + reservationFee + superfastFee + gst;

    const pnr = generateUniquePNR();
    const qrToken = `RAILSMART-TICKET-${pnr}-${Date.now()}`;

    // Seat Allocation
    const coaches = travelClass === '1A' ? ['H1'] : travelClass === '2A' ? ['A1', 'A2'] : travelClass === '3A' ? ['B1', 'B2', 'B3'] : travelClass === 'EC' ? ['E1'] : ['S1', 'S2', 'S3', 'S4'];
    const assignedCoach = coaches[Math.floor(Math.random() * coaches.length)];

    const berthTypes = ['LOWER', 'MIDDLE', 'UPPER', 'SIDE LOWER', 'SIDE UPPER', 'WINDOW'];

    const bookedPassengers = passengers.map((p, idx) => ({
      name: p.name,
      age: parseInt(p.age, 10),
      gender: p.gender,
      berthPreference: p.berthPreference || 'no_preference',
      allocatedCoach: assignedCoach,
      allocatedBerth: (idx * 3 + Math.floor(Math.random() * 20) + 1),
      allocatedBerthType: p.berthPreference && p.berthPreference !== 'no_preference' ? p.berthPreference.toUpperCase() : berthTypes[idx % berthTypes.length],
      currentStatus: 'CNF',
      statusDetails: `Confirmed (${assignedCoach} / ${idx * 3 + 12})`
    }));

    // Create Payment Record
    const payment = await Payment.create({
      userId: req.user._id,
      pnr,
      transactionId: `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      amount: totalFare,
      paymentMethod: paymentMethod || 'UPI',
      status: 'SUCCESS'
    });

    const booking = await Booking.create({
      pnr,
      userId: req.user._id,
      trainId: train._id,
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      fromStation: train.fromStationCode,
      toStation: train.toStationCode,
      fromStationName: train.fromStationName,
      toStationName: train.toStationName,
      journeyDate,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      travelClass,
      quota: quota || 'GENERAL',
      passengers: bookedPassengers,
      fareBreakdown: {
        baseFare: baseFareTotal,
        reservationFee,
        superfastFee,
        cateringFee: 0,
        gst,
        totalFare
      },
      status: 'CONFIRMED',
      chartPrepared: false,
      qrToken,
      paymentId: payment._id
    });

    payment.bookingId = booking._id;
    await payment.save();

    // Create In-App Notification Reminder
    await Notification.create({
      userId: req.user._id,
      type: 'JOURNEY_REMINDER',
      title: `🎫 Ticket Confirmed: PNR ${pnr}`,
      message: `Your booking for ${train.trainName} (${train.trainNumber}) on ${journeyDate} is confirmed. Coach ${assignedCoach}.`,
      metadata: { pnr, trainNumber: train.trainNumber }
    });

    res.status(201).json({
      success: true,
      message: 'Ticket booked successfully!',
      pnr,
      booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Booking failed. Please try again.' });
  }
};

// @desc PNR Status Enquiry
// @route GET /api/pnr/:pnr
const getPNRStatus = async (req, res) => {
  try {
    const { pnr } = req.params;
    const booking = await Booking.findOne({ pnr: pnr.trim() }).populate('trainId');

    if (!booking) {
      // Return simulated valid PNR if looking up demo numbers
      return res.json({
        success: true,
        isSimulated: true,
        pnr,
        trainNumber: '22436',
        trainName: 'Vande Bharat Express',
        fromStation: 'NDLS',
        fromStationName: 'New Delhi',
        toStation: 'BSB',
        toStationName: 'Varanasi Jn',
        journeyDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
        travelClass: 'CC',
        quota: 'GENERAL',
        chartPrepared: true,
        status: 'CONFIRMED',
        passengers: [
          { name: 'Rohan Sharma', age: 29, gender: 'Male', allocatedCoach: 'C2', allocatedBerth: 45, allocatedBerthType: 'WINDOW', currentStatus: 'CNF', statusDetails: 'Confirmed' }
        ],
        fareBreakdown: { totalFare: 1750 }
      });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch PNR status' });
  }
};

// @desc Get User's Bookings
// @route GET /api/bookings/my
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
};

// @desc Cancel Booking & Trigger Instant Refund
// @route POST /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Ticket is already cancelled' });
    }

    const cancellationCharges = 180 * booking.passengers.length;
    const refundAmount = Math.max(0, booking.fareBreakdown.totalFare - cancellationCharges);
    const refundRef = `RFD_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    booking.status = 'CANCELLED';
    booking.cancellationDetails = {
      cancelledAt: new Date(),
      refundAmount,
      refundStatus: 'PROCESSED',
      refundRef
    };
    await booking.save();

    // Create Refund Audit
    const refund = await Refund.create({
      bookingId: booking._id,
      userId: req.user._id,
      pnr: booking.pnr,
      totalPaid: booking.fareBreakdown.totalFare,
      cancellationCharges,
      refundAmount,
      status: 'CREDITED_TO_SOURCE',
      refundRef,
      timeline: [
        { stage: 'Cancellation Requested', message: 'User requested ticket cancellation.' },
        { stage: 'Charges Calculated', message: `Standard deduction ₹${cancellationCharges} applied.` },
        { stage: 'Refund Credited', message: `Amount ₹${refundAmount} credited to original payment source.` }
      ]
    });

    // Alert
    await Notification.create({
      userId: req.user._id,
      type: 'PNR_STATUS',
      title: `❌ Ticket Cancelled: PNR ${booking.pnr}`,
      message: `Refund of ₹${refundAmount} processed successfully (Ref: ${refundRef}).`
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully. Refund initiated.',
      refund
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Cancellation failed' });
  }
};

// @desc Get Refund Status by PNR / Booking
// @route GET /api/bookings/refunds/:pnr
const getRefundStatus = async (req, res) => {
  try {
    const refund = await Refund.findOne({ pnr: req.params.pnr });
    if (!refund) {
      return res.status(404).json({ success: false, message: 'No refund record found for this PNR' });
    }
    res.json({ success: true, refund });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch refund status' });
  }
};

module.exports = { createBooking, getPNRStatus, getUserBookings, cancelBooking, getRefundStatus };