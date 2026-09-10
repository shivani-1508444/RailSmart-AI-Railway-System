const express = require('express');
const router = express.Router();
const { chatWithRailBot, getConfirmationPrediction } = require('../controllers/aiController');

router.post('/chat', chatWithRailBot);
router.post('/prediction', getConfirmationPrediction);

module.exports = router;