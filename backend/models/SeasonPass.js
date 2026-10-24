const mongoose = require('mongoose');
const crypto = require('crypto');

const seasonPassSchema = new mongoose.Schema(
  {
    applicationNumber: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true
    },
    fullName: {
      type: String,
      required: [true, 'Applicant full name is required'],
      trim: true
    },
    nicOrStudentId: {
      type: String,
      required: [true, 'NIC or School/University Student ID is required'],
      trim: true,
      uppercase: true
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other']
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact phone number is required']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    passType: {
      type: String,
      enum: ['School Student', 'Higher Education / University', 'Government Employee', 'General Passenger'],
      required: true,
      default: 'School Student'
    },
    institutionOrEmployer: {
      type: String,
      required: [true, 'School, College, or Employer name is required'],
      trim: true
    },
    routeNumber: {
      type: String,
      required: [true, 'Designated route number is required'],
      trim: true
    },
    travelOrigin: {
      type: String,
      required: [true, 'Origin bus stop is required'],
      trim: true
    },
    travelDestination: {
      type: String,
      required: [true, 'Destination bus stop is required'],
      trim: true
    },
    sltbDepotOffice: {
      type: String,
      default: 'Colombo Central Depot'
    },
    durationMonths: {
      type: Number,
      enum: [1, 3, 6, 12],
      default: 1
    },
    validFrom: {
      type: Date,
      default: Date.now
    },
    validUntil: {
      type: Date
    },
    fareAmountLKR: {
      type: Number,
      default: 150
    },
    approvalStatus: {
      type: String,
      enum: ['Pending Verification', 'Approved & Issued', 'Rejected', 'Suspended'],
      default: 'Approved & Issued'
    },
    qrCodeToken: {
      type: String,
      unique: true,
      trim: true
    },
    verificationKey: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to generate application number and QR verification token
seasonPassSchema.pre('save', function (next) {
  if (!this.applicationNumber) {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    this.applicationNumber = `GL-${this.passType.substring(0, 2).toUpperCase()}-${randomDigits}`;
  }
  if (!this.qrCodeToken) {
    this.qrCodeToken = `GOLANKA-PASS-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
  }
  if (!this.validUntil) {
    const expiry = new Date(this.validFrom || Date.now());
    expiry.setMonth(expiry.getMonth() + (this.durationMonths || 1));
    this.validUntil = expiry;
  }
  next();
});

module.exports = mongoose.model('SeasonPass', seasonPassSchema);
