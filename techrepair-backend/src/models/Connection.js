const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
  accessCode: { type: String, required: true, unique: true },
  technician: { type: String },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  permissions: {
    screen: { type: Boolean, default: false },
    keyboard: { type: Boolean, default: false },
    mouse: { type: Boolean, default: false }
  },
  startTime: { type: Date },
  endTime: { type: Date },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('Connection', ConnectionSchema);
