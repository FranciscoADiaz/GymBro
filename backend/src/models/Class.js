const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    schedule: {
      type: String,
      trim: true,
    },
    capacity: {
      type: Number,
      min: 0,
    },
    trainer: {
      type: String,
      trim: true,
    },
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
    },
  },
  { timestamps: true }
);

classSchema.index({ gym: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Class', classSchema);

