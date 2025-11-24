const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderType: { type: String, enum: ['client', 'technician'], required: true },
  connectionId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
