const mongoose = require('mongoose');

const statusEnum = ['active', 'inactive'];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;

const memberSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      match: [nameRegex, 'Solo letras permitidas'],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      match: [nameRegex, 'Solo letras permitidas'],
    },
    dni: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: [/^\d+$/, 'Solo números permitidos'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => emailRegex.test(value),
        message: 'Formato de email inválido',
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

module.exports = mongoose.model('Member', memberSchema);
