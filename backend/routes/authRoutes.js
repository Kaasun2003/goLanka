const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');

// Generate simulated auth token
const generateToken = (userId) => {
  return `GL_TOKEN_${userId}_${Date.now()}`;
};

// Seed demo users for in-memory and instant testing
const sampleUsers = [
  {
    _id: 'user-demo-01',
    fullName: 'Kasun Malinda Bandara',
    phoneNumber: '0773456789',
    email: 'kasun.m@gmail.com',
    password: crypto.createHash('sha256').update('golanka123').digest('hex'),
    nicNumber: '200428901234',
    userType: 'Student',
    avatar: '🎓',
    savedRoutes: [
      {
        routeNumber: '138',
        routeName: 'Colombo (Pettah) - Maharagama / Homagama',
        origin: 'Maharagama',
        destination: 'Pettah',
        savedAt: new Date()
      },
      {
        routeNumber: '100',
        routeName: 'Colombo (Pettah) - Moratuwa / Panadura',
        origin: 'Moratuwa',
        destination: 'Pettah',
        savedAt: new Date()
      }
    ],
    activeSeasonPassId: 'GL-SC-789012',
    activeSeasonPass: {
      applicationNumber: 'GL-SC-789012',
      passType: 'School / University Student Pass',
      routeNumber: '138',
      travelOrigin: 'Maharagama Clock Tower',
      travelDestination: 'Pettah / Maradana',
      validFrom: '2026-04-01',
      validUntil: '2026-05-31',
      fareAmountLKR: 180,
      approvalStatus: 'Approved & Issued',
      qrCodeToken: 'GOLANKA-PASS-138-KM-2026'
    },
    bookingHistory: [
      {
        bookingId: 'BK-EX-8902',
        routeNumber: 'EX-001',
        serviceName: 'Southern Expressway Luxury Coach',
        origin: 'Makumbura (Kottawa)',
        destination: 'Galle Central Terminal',
        travelDate: '2026-04-20',
        seatNumbers: ['14', '15'],
        fareLKR: 1700,
        status: 'Confirmed',
        bookedAt: new Date('2026-04-10')
      },
      {
        bookingId: 'BK-SP-1092',
        routeNumber: '138',
        serviceName: 'Digital Season Pass Monthly Subsidy',
        origin: 'Maharagama',
        destination: 'Pettah',
        travelDate: '2026-04-01',
        seatNumbers: ['Pass QR'],
        fareLKR: 180,
        status: 'Completed',
        bookedAt: new Date('2026-04-01')
      }
    ],
    createdAt: new Date('2026-01-01')
  },
  {
    _id: 'user-demo-02',
    fullName: 'Dilani Sewwandi Perera',
    phoneNumber: '0718901234',
    email: 'dilani.perera@office.lk',
    password: crypto.createHash('sha256').update('golanka123').digest('hex'),
    nicNumber: '199878902345',
    userType: 'Office Commuter',
    avatar: '💼',
    savedRoutes: [
      {
        routeNumber: '100',
        routeName: 'Colombo (Pettah) - Moratuwa / Panadura',
        origin: 'Panadura',
        destination: 'Colombo Fort',
        savedAt: new Date()
      }
    ],
    activeSeasonPassId: 'GL-OF-443912',
    activeSeasonPass: {
      applicationNumber: 'GL-OF-443912',
      passType: 'Government / Private Office Commuter Pass',
      routeNumber: '100',
      travelOrigin: 'Panadura Bus Stand',
      travelDestination: 'Colombo Fort / Galle Face',
      validFrom: '2026-04-01',
      validUntil: '2026-05-31',
      fareAmountLKR: 550,
      approvalStatus: 'Approved & Issued',
      qrCodeToken: 'GOLANKA-PASS-100-DSP-2026'
    },
    bookingHistory: [
      {
        bookingId: 'BK-NCG-4412',
        routeNumber: 'NCG-01',
        serviceName: 'NCG Super Luxury Expressway',
        origin: 'Colombo (Bastian Mawatha)',
        destination: 'Kandy (Goods Shed)',
        travelDate: '2026-04-15',
        seatNumbers: ['8'],
        fareLKR: 950,
        status: 'Completed',
        bookedAt: new Date('2026-04-05')
      }
    ],
    createdAt: new Date('2026-02-01')
  }
];

// In-memory user store fallback
let inMemoryUsers = [...sampleUsers];
const simulatedOtps = new Map(); // phone -> { otp, expiresAt }

// Helper to sanitize user object
const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;
  delete userObj.otpCode;
  delete userObj.otpExpiresAt;
  return userObj;
};

// 1. POST /api/auth/send-otp (Simulate mobile OTP SMS)
router.post('/send-otp', async (req, res) => {
  try {
    let { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: 'දුරකථන අංකය ඇතුළත් කරන්න / Phone number is required' });
    }

    // Clean phone number (e.g. 0771234567 or +94771234567)
    phoneNumber = phoneNumber.replace(/[\s-]/g, '');

    // Generate easy 4-digit OTP (demo default: 1955 which is SLTB hotline number!)
    const otp = '1955';
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    simulatedOtps.set(phoneNumber, { otp, expiresAt });

    console.log(`📲 [SMS Gateway Simulation] Sent OTP ${otp} to ${phoneNumber}`);

    return res.status(200).json({
      success: true,
      message: `SMS මඟින් රහස් අංකය යවන ලදී / OTP sent via SMS to ${phoneNumber}`,
      demoOtp: otp, // Returned for instant demo testing
      phoneNumber
    });
  } catch (error) {
    console.error('Error in send-otp:', error);
    return res.status(500).json({ success: false, message: 'Server error sending OTP' });
  }
});

// 2. POST /api/auth/verify-otp (Verify phone OTP & Login or Quick Register)
router.post('/verify-otp', async (req, res) => {
  try {
    let { phoneNumber, otp, otpCode } = req.body;
    otp = (otp || otpCode || '').trim();

    if (!phoneNumber || !otp) {
      return res.status(400).json({ success: false, message: 'Phone number and 4-digit OTP are required' });
    }

    phoneNumber = phoneNumber.replace(/[\s-]/g, '');
    const storedOtpData = simulatedOtps.get(phoneNumber);

    // Accept valid generated OTP or standard default demo OTP '1955' or '1234'
    const isValid = (storedOtpData && storedOtpData.otp === otp) || otp === '1955' || otp === '1234';

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'වැරදි හෝ කල්ඉකුත් වූ අංකයකි / Invalid or expired OTP. Please enter 1955.'
      });
    }

    // Find existing user in MongoDB or in-memory
    let user = null;
    try {
      user = await User.findOne({ phoneNumber });
    } catch (e) {
      // MongoDB fallback
    }

    if (!user) {
      user = inMemoryUsers.find((u) => u.phoneNumber === phoneNumber);
    }

    // If new user via OTP, create an account automatically!
    if (!user) {
      const newUser = {
        _id: `user-${Date.now()}`,
        fullName: `Passenger ${phoneNumber.slice(-4)}`,
        phoneNumber,
        email: `passenger${phoneNumber.slice(-4)}@golanka.lk`,
        userType: 'General',
        avatar: '👤',
        savedRoutes: [
          {
            routeNumber: '138',
            routeName: 'Colombo (Pettah) - Maharagama / Homagama',
            origin: 'Maharagama',
            destination: 'Pettah',
            savedAt: new Date()
          }
        ],
        activeSeasonPassId: null,
        bookingHistory: [],
        createdAt: new Date()
      };

      try {
        const created = await User.create(newUser);
        user = created;
      } catch (err) {
        inMemoryUsers.push(newUser);
        user = newUser;
      }
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'සාර්ථකව ලොග් විය! / Login successful',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return res.status(500).json({ success: false, message: 'Server error verifying OTP' });
  }
});

// 3. POST /api/auth/register (Standard Full Registration)
router.post('/register', async (req, res) => {
  try {
    let { fullName, phoneNumber, email, password, nicNumber, userType } = req.body;

    if (!fullName || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'සම්පූර්ණ නම සහ දුරකථන අංකය අනිවාර්යයි / Full name and phone number are required'
      });
    }

    phoneNumber = phoneNumber.replace(/[\s-]/g, '');

    // Check if phone or email already registered
    let existingUser = inMemoryUsers.find(
      (u) => u.phoneNumber === phoneNumber || (email && u.email && u.email.toLowerCase() === email.toLowerCase())
    );

    if (!existingUser) {
      try {
        existingUser = await User.findOne({
          $or: [{ phoneNumber }, ...(email ? [{ email: email.toLowerCase() }] : [])]
        });
      } catch (e) {}
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'මෙම දුරකථන අංකය හෝ ඊමේල් ලිපිනය දැනටමත් ලියාපදිංචි කර ඇත / Phone number or email already registered'
      });
    }

    const hashedPassword = password ? crypto.createHash('sha256').update(password).digest('hex') : null;

    const avatarMap = {
      Student: '🎓',
      'Office Commuter': '💼',
      General: '👤'
    };

    const newUser = {
      _id: `user-${Date.now()}`,
      fullName: fullName.trim(),
      phoneNumber,
      email: email ? email.toLowerCase().trim() : `user${Date.now()}@golanka.lk`,
      password: hashedPassword,
      nicNumber: nicNumber ? nicNumber.trim().toUpperCase() : '',
      userType: userType || 'General',
      avatar: avatarMap[userType] || '👤',
      savedRoutes: [
        {
          routeNumber: '138',
          routeName: 'Colombo (Pettah) - Maharagama / Homagama',
          origin: 'Maharagama',
          destination: 'Pettah',
          savedAt: new Date()
        }
      ],
      activeSeasonPassId: userType === 'Student' ? 'GL-SC-789012' : null,
      activeSeasonPass:
        userType === 'Student'
          ? {
              applicationNumber: 'GL-SC-789012',
              passType: 'School / University Student Pass',
              routeNumber: '138',
              travelOrigin: 'Maharagama Clock Tower',
              travelDestination: 'Pettah / Maradana',
              validFrom: '2026-04-01',
              validUntil: '2026-05-31',
              fareAmountLKR: 180,
              approvalStatus: 'Approved & Issued',
              qrCodeToken: 'GOLANKA-PASS-138-KM-2026'
            }
          : null,
      bookingHistory: [],
      createdAt: new Date()
    };

    let savedUser = null;
    try {
      savedUser = await User.create(newUser);
    } catch (err) {
      inMemoryUsers.push(newUser);
      savedUser = newUser;
    }

    const token = generateToken(savedUser._id);

    return res.status(201).json({
      success: true,
      message: 'ගිණුම සාර්ථකව සාදන ලදී! / Account created successfully!',
      token,
      user: sanitizeUser(savedUser)
    });
  } catch (error) {
    console.error('Error in register:', error);
    return res.status(500).json({ success: false, message: 'Server error creating account' });
  }
});

// 4. POST /api/auth/login (Email / Phone + Password)
router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'දුරකථන අංකය/ඊමේල් සහ මුරපදය ඇතුළත් කරන්න / Phone or Email and password required'
      });
    }

    const cleanInput = emailOrPhone.replace(/[\s-]/g, '').toLowerCase();
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Find in memory or Mongo
    let user = inMemoryUsers.find(
      (u) =>
        (u.phoneNumber && u.phoneNumber.replace(/[\s-]/g, '') === cleanInput) ||
        (u.email && u.email.toLowerCase() === cleanInput)
    );

    if (!user) {
      try {
        user = await User.findOne({
          $or: [{ phoneNumber: cleanInput }, { email: cleanInput }]
        });
      } catch (e) {}
    }

    // Default demo bypass if user enters demo password 'golanka123'
    const passwordMatches = user && (user.password === hashedPassword || password === 'golanka123');

    if (!user || !passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'දුරකථන අංකය හෝ මුරපදය වැරදියි / Invalid phone/email or password'
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'සාර්ථකව ලොග් විය! / Login successful',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// 5. GET /api/auth/profile
router.get('/profile', async (req, res) => {
  try {
    const userId = req.query.userId || req.headers['x-user-id'];

    let user = inMemoryUsers.find((u) => u._id === userId);
    if (!user && userId) {
      try {
        user = await User.findById(userId);
      } catch (e) {}
    }

    // Default to demo student user if not found or empty
    if (!user) {
      user = inMemoryUsers[0];
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Error in get profile:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
});

// 6. PUT /api/auth/profile (Update details)
router.put('/profile', async (req, res) => {
  try {
    const { userId, fullName, email, nicNumber, userType } = req.body;
    let user = inMemoryUsers.find((u) => u._id === userId);

    if (!user) {
      try {
        user = await User.findById(userId);
      } catch (e) {}
    }

    if (!user) {
      user = inMemoryUsers[0];
    }

    if (fullName) user.fullName = fullName.trim();
    if (email) user.email = email.trim();
    if (nicNumber) user.nicNumber = nicNumber.trim().toUpperCase();
    if (userType) {
      user.userType = userType;
      const avatarMap = { Student: '🎓', 'Office Commuter': '💼', General: '👤' };
      user.avatar = avatarMap[userType] || '👤';
    }

    return res.status(200).json({
      success: true,
      message: 'තොරතුරු සාර්ථකව යාවත්කාලීන විය / Profile updated successfully',
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Error in update profile:', error);
    return res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
});

// 7. POST /api/auth/save-route (Add or remove saved favorite route)
router.post('/save-route', async (req, res) => {
  try {
    const { userId, routeNumber, routeName, origin, destination } = req.body;
    let user = inMemoryUsers.find((u) => u._id === userId);

    if (!user) {
      user = inMemoryUsers[0];
    }

    if (!user.savedRoutes) user.savedRoutes = [];

    const existingIdx = user.savedRoutes.findIndex((r) => r.routeNumber === routeNumber);
    if (existingIdx >= 0) {
      user.savedRoutes.splice(existingIdx, 1);
      return res.status(200).json({
        success: true,
        message: 'Route removed from favorites',
        savedRoutes: user.savedRoutes
      });
    } else {
      user.savedRoutes.push({
        routeNumber,
        routeName: routeName || `Route ${routeNumber}`,
        origin: origin || 'Colombo',
        destination: destination || 'Suburbs',
        savedAt: new Date()
      });
      return res.status(200).json({
        success: true,
        message: 'Route added to favorites',
        savedRoutes: user.savedRoutes
      });
    }
  } catch (error) {
    console.error('Error in save-route:', error);
    return res.status(500).json({ success: false, message: 'Server error saving route' });
  }
});

// 8. POST /api/auth/renew-season-pass (One-click renew for next month)
router.post('/renew-season-pass', async (req, res) => {
  try {
    const { userId } = req.body;
    let user = inMemoryUsers.find((u) => u._id === userId);

    if (!user) {
      user = inMemoryUsers[0];
    }

    if (!user.activeSeasonPass) {
      user.activeSeasonPass = {
        applicationNumber: `GL-${user.userType === 'Student' ? 'SC' : 'OF'}-${Math.floor(100000 + Math.random() * 900000)}`,
        passType: `${user.userType} Digital Transit Pass`,
        routeNumber: '138',
        travelOrigin: 'Maharagama Clock Tower',
        travelDestination: 'Pettah / Maradana',
        validFrom: '2026-05-01',
        validUntil: '2026-06-30',
        fareAmountLKR: user.userType === 'Student' ? 180 : 550,
        approvalStatus: 'Approved & Issued',
        qrCodeToken: `GOLANKA-RENEW-${Date.now()}`
      };
    } else {
      // Extend validity by 30 days
      const currentExpiry = new Date(user.activeSeasonPass.validUntil || Date.now());
      currentExpiry.setMonth(currentExpiry.getMonth() + 1);
      user.activeSeasonPass.validUntil = currentExpiry.toISOString().split('T')[0];
    }

    // Add payment entry to bookingHistory
    const renewalBooking = {
      bookingId: `RNW-SP-${Date.now().toString().slice(-4)}`,
      routeNumber: user.activeSeasonPass.routeNumber || '138',
      serviceName: 'Digital Season Pass 1-Month Renewal',
      origin: user.activeSeasonPass.travelOrigin || 'Origin',
      destination: user.activeSeasonPass.travelDestination || 'Destination',
      travelDate: user.activeSeasonPass.validUntil,
      seatNumbers: ['Renewed QR'],
      fareLKR: user.activeSeasonPass.fareAmountLKR || 180,
      status: 'Confirmed',
      bookedAt: new Date()
    };

    if (!user.bookingHistory) user.bookingHistory = [];
    user.bookingHistory.unshift(renewalBooking);

    return res.status(200).json({
      success: true,
      message: 'වාර ප්‍රවේශපත්‍රය සාර්ථකව මසකින් දීර්ඝ කරන ලදී! / Season pass renewed successfully for next month!',
      seasonPass: user.activeSeasonPass,
      activeSeasonPass: user.activeSeasonPass,
      user: sanitizeUser(user),
      bookingHistory: user.bookingHistory
    });
  } catch (error) {
    console.error('Error in renew-season-pass:', error);
    return res.status(500).json({ success: false, message: 'Server error renewing pass' });
  }
});

module.exports = router;
