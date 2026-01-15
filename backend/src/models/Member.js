const mongoose = require('mongoose');

const statusEnum = ['active', 'inactive'];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const memberSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    dni: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true,
      validate: {
        validator: (value) => !value || emailRegex.test(value),
        message: 'Invalid email format',
      },
    },
    phone: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    activeUntil: {
      type: Date,
      default: null,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: statusEnum,
      default: 'inactive',
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
    },
  },
  { timestamps: true }
);

memberSchema.index({ gym: 1, dni: 1 }, { unique: true });

module.exports = mongoose.model('Member', memberSchema);
