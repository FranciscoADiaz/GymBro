const mongoose = require('mongoose');

const statusEnum = ['ACCESS_GRANTED', 'ACCESS_DENIED'];

const attendanceSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: statusEnum,
      required: true,
    },
    checkInMethod: {
      type: String,
      default: 'SYSTEM',
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

attendanceSchema.index({ gym: 1, memberId: 1, date: -1 });

module.exports = mongoose.model('Attendance', attendanceSchema);

