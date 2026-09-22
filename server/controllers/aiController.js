const { parseRailBotIntent, calculateConfirmationProbability } = require('../services/aiService');
const ChatLog = require('../models/ChatLog');

// @desc RailBot AI Conversational Chatbot
// @route POST /api/ai/chat
const chatWithRailBot = async (req, res) => {
  try {
    const { message, sessionId, context } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const aiResult = await parseRailBotIntent(message, context);

    const logData = {
      sessionId: sessionId || 'session_guest',
      userMessage: message,
      botReply: aiResult.reply,
      detectedIntent: aiResult.intent
    };
    if (req.user) {
      logData.userId = req.user._id;
    }
    await ChatLog.create(logData);

    res.json({
      success: true,
      reply: aiResult.reply,
      intent: aiResult.intent,
      pnr: aiResult.pnr || null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'AI Chat service error' });
  }
};

// @desc AI Waitlist Confirmation Probability Estimator
// @route POST /api/ai/prediction
const getConfirmationPrediction = async (req, res) => {
  try {
    const { currentStatus, classCode, journeyDate } = req.body;
    
    let daysRemaining = 5;
    if (journeyDate) {
      const diff = new Date(journeyDate).getTime() - Date.now();
      daysRemaining = Math.max(1, Math.round(diff / (1000 * 3600 * 24)));
    }

    const prediction = calculateConfirmationProbability(currentStatus || 'WL 14', classCode || '3A', daysRemaining);
    res.json({ success: true, prediction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to calculate prediction' });
  }
};

module.exports = { chatWithRailBot, getConfirmationPrediction };