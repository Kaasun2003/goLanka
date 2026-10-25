const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true
    },
    password: {
      type: String
    },
    nicNumber: {
      type: String,
      trim: true,
      uppercase: true
    },
    userType: {
      type: String,
      enum: ['Student', 'Office Commuter', 'General'],
      default: 'General'
    },
    avatar: {
      type: String,
      default: '👤'
    },
    savedRoutes: [
      {
        routeNumber: { type: String, required: true },
        routeName: { type: String },
        origin: { type: String },
        destination: { type: String },
        savedAt: { type: Date, default: Date.now }
      }
    ],
    activeSeasonPassId: {
      type: String,
      default: null
    },
    otpCode: {
      type: String
    },
    otpExpiresAt: {
      type: Date
    },
    bookingHistory: [
      {
        bookingId: { type: String },
        routeNumber: { type: String },
        serviceName: { type: String },
        origin: { type: String },
        destination: { type: String },
        travelDate: { type: String },
        seatNumbers: [{ type: String }],
        fareLKR: { type: Number },
        status: { type: String, enum: ['Confirmed', 'Completed', 'Cancelled'], default: 'Confirmed' },
        bookedAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Hash password utility using Node.js crypto
userSchema.statics.hashPassword = function (plainPassword) {
  return crypto.createHash('sha256').update(plainPassword).digest('hex');
};

userSchema.methods.verifyPassword = function (plainPassword) {
  const hash = crypto.createHash('sha256').update(plainPassword).digest('hex');
  return this.password === hash;
};

module.exports = mongoose.model('User', userSchema);
