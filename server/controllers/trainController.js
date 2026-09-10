const Train = require('../models/Train');
const Station = require('../models/Station');
const { getSimulatedLiveStatus } = require('../services/liveStatusService');

// @desc Search Trains
// @route GET /api/trains/search
const searchTrains = async (req, res) => {
  try {
    const { from, to, date, classType, quota } = req.query;

    let query = {};
    if (from && to) {
      query = {
        $or: [
          { fromStationCode: from.toUpperCase(), toStationCode: to.toUpperCase() },
          { fromStationName: { $regex: from, $options: 'i' }, toStationName: { $regex: to, $options: 'i' } },
          { 'route.stationCode': from.toUpperCase(), 'route.stationCode': to.toUpperCase() }
        ]
      };
    }

    let trains = await Train.find(query);

    // If exact query yields no trains, return popular trains to keep UI interactive
    if (trains.length === 0) {
      trains = await Train.find({}).limit(10);
    }

    res.json({
      success: true,
      count: trains.length,
      trains,
      searchParams: { from, to, date, classType, quota }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error searching trains' });
  }
};

// @desc Get All Stations (for autocomplete)
// @route GET /api/trains/stations
const getStations = async (req, res) => {
  try {
    const stations = await Station.find({}).sort({ name: 1 });
    res.json({ success: true, stations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stations' });
  }
};

// @desc Get Single Train Details
// @route GET /api/trains/:id
const getTrainDetails = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) {
      return res.status(404).json({ success: false, message: 'Train not found' });
    }
    res.json({ success: true, train });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error loading train details' });
  }
};

// @desc Get Live Running Status of Train
// @route GET /api/trains/:id/status
const getLiveTrainStatus = async (req, res) => {
  try {
    const idOrNumber = req.params.id;
    let train = null;

    // First try to find by train number (most common use case)
    train = await Train.findOne({ trainNumber: idOrNumber });

    // If not found by number, try by MongoDB ID (only if it looks like one)
    if (!train && idOrNumber.match(/^[a-f\d]{24}$/i)) {
      train = await Train.findById(idOrNumber);
    }

    // If still not found, return simulated data so UI is never blank
    if (!train) {
      return res.json({
        success: true,
        liveStatus: {
          trainNumber: idOrNumber,
          trainName: `Train ${idOrNumber}`,
          trainType: 'Express',
          status: 'ON_TIME',
          delayMinutes: 0,
          currentStation: 'New Delhi',
          currentStationCode: 'NDLS',
          nextStation: 'Kanpur Central',
          nextStationCode: 'CNB',
          platform: 3,
          speedKmh: 110,
          distanceCoveredKm: 215,
          totalDistanceKm: 1380,
          stationsTimeline: [
            { stationCode: 'NDLS', stationName: 'New Delhi', scheduledArrival: '06:00 AM', scheduledDeparture: '06:00 AM', platform: 3, distanceKm: 0, isPassed: true, isCurrent: false },
            { stationCode: 'CNB', stationName: 'Kanpur Central', scheduledArrival: '11:20 AM', scheduledDeparture: '11:25 AM', platform: 1, distanceKm: 440, isPassed: false, isCurrent: true },
            { stationCode: 'ALD', stationName: 'Prayagraj Junction', scheduledArrival: '12:50 PM', scheduledDeparture: '12:55 PM', platform: 2, distanceKm: 635, isPassed: false, isCurrent: false },
            { stationCode: 'BSB', stationName: 'Varanasi Junction', scheduledArrival: '02:30 PM', scheduledDeparture: '02:30 PM', platform: 1, distanceKm: 764, isPassed: false, isCurrent: false }
          ],
          lastUpdated: new Date()
        }
      });
    }

    const liveData = getSimulatedLiveStatus(train, req.query.date);
    res.json({ success: true, liveStatus: liveData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to retrieve live running status' });
  }
};

module.exports = { searchTrains, getStations, getTrainDetails, getLiveTrainStatus };