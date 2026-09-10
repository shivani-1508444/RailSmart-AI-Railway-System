const express = require('express');
const router = express.Router();
const { searchTrains, getStations, getTrainDetails, getLiveTrainStatus } = require('../controllers/trainController');

router.get('/search', searchTrains);
router.get('/stations', getStations);
router.get('/:id', getTrainDetails);
router.get('/:id/status', getLiveTrainStatus);

module.exports = router;