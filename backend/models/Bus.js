const mongoose = require('mongoose');

const busSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, 'Bus registration number is required (e.g., WP NA-5432, ND-8941)'],
      unique: true,
      trim: true,
      uppercase: true
    },
    routeNumber: {
      type: String,
      required: true,
      trim: true
    },
    assignedRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route'
    },
    busType: {
      type: String,
      enum: ['SLTB Standard', 'Private Normal', 'Semi-Luxury', 'Super Luxury AC', 'Highway Express'],
      default: 'Private Normal'
    },
    operatorType: {
      type: String,
      enum: ['SLTB', 'Private Operator', 'NTC Super Coach'],
      default: 'Private Operator'
    },
    depotOrTerminal: {
      type: String,
      default: 'Bastian Mawatha Bus Station (Pettah)'
    },
    capacity: {
      totalSeats: { type: Number, default: 54 },
      standingCapacity: { type: Number, default: 20 }
    },
    driverDetails: {
      name: { type: String, required: true, trim: true },
      contactNumber: { type: String, required: true },
      licenseNumber: { type: String, trim: true },
      conductorName: { type: String, trim: true },
      conductorContact: { type: String, trim: true }
    },
    currentStatus: {
      type: String,
      enum: ['In Transit', 'Scheduled', 'Delayed', 'At Terminal', 'Off Service'],
      default: 'In Transit'
    },
    currentLocation: {
      lat: { type: Number, default: 6.9271 },
      lng: { type: Number, default: 79.8612 },
      speedKmH: { type: Number, default: 0 },
      headingDegrees: { type: Number, default: 0 },
      lastUpdated: { type: Date, default: Date.now },
      isSignalLost: { type: Boolean, default: false }
    },
    isLiveTrackingActive: {
      type: Boolean,
      default: true
    },
    amenities: {
      hasAC: { type: Boolean, default: false },
      hasWifi: { type: Boolean, default: false },
      hasUSBCharging: { type: Boolean, default: false },
      isCCTVMonitored: { type: Boolean, default: true }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Bus', busSchema);
