const mongoose = require('mongoose');

const intermediateStopSchema = new mongoose.Schema({
  stopName: {
    type: String,
    required: true,
    trim: true
  },
  stopNameSinhala: {
    type: String,
    trim: true
  },
  stopNameTamil: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    required: true
  },
  distanceFromStartKm: {
    type: Number,
    default: 0
  },
  estimatedTimeMins: {
    type: Number,
    default: 0
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }
});

const routeSchema = new mongoose.Schema(
  {
    routeNumber: {
      type: String,
      required: [true, 'Route number is required (e.g., 138, 100, 1)'],
      trim: true,
      index: true
    },
    routeName: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['Normal', 'Semi-Luxury', 'Luxury AC', 'Highway Express', 'Intercity'],
      default: 'Normal'
    },
    operator: {
      type: String,
      enum: ['SLTB', 'Private', 'Joint Service'],
      default: 'Joint Service'
    },
    startLocation: {
      name: { type: String, required: true, trim: true },
      nameSinhala: { type: String, trim: true },
      nameTamil: { type: String, trim: true },
      city: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }
    },
    endLocation: {
      name: { type: String, required: true, trim: true },
      nameSinhala: { type: String, trim: true },
      nameTamil: { type: String, trim: true },
      city: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }
    },
    intermediateStops: [intermediateStopSchema],
    distanceKm: {
      type: Number,
      default: 0
    },
    approxDurationMins: {
      type: Number,
      default: 0
    },
    fareRange: {
      minLKR: { type: Number, default: 30 },
      maxLKR: { type: Number, default: 400 }
    },
    firstBusTime: {
      type: String,
      default: '05:00 AM'
    },
    lastBusTime: {
      type: String,
      default: '11:00 PM'
    },
    frequencyMins: {
      type: Number,
      default: 15
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Route', routeSchema);
