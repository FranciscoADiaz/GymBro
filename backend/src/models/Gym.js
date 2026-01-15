const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  inviteCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Gym', gymSchema);

