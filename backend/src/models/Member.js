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
      unique: true,
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
    profileImage: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: statusEnum,
      default: 'active',
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Member', memberSchema);
