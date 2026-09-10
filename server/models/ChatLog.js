const mongoose = require('mongoose');

const ChatLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: { type: String, required: true },
  userMessage: { type: String, required: true },
  botReply: { type: String, required: true },
  detectedIntent: { type: String },
  confidence: { type: Number, default: 0.95 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatLog', ChatLogSchema);