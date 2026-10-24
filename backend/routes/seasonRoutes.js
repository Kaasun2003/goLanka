const express = require('express');
const router = express.Router();
const SeasonPass = require('../models/SeasonPass');

// Mock sample passes for testing and instant demonstration
const sampleSeasonPasses = [
  {
    _id: 'sp-demo-01',
    applicationNumber: 'GL-SC-789012',
    fullName: 'Kasun Malinda Bandara',
    nicOrStudentId: '200428901234',
    contactNumber: '+94 77 345 6789',
    email: 'kasun.m@gmail.com',
    passType: 'School Student',
    institutionOrEmployer: 'Ananda College, Colombo',
    routeNumber: '138',
    travelOrigin: 'Maharagama Clock Tower',
    travelDestination: 'Pettah / Maradana',
    sltbDepotOffice: 'Maharagama SLTB Depot',
    durationMonths: 3,
    validFrom: new Date('2026-01-01'),
    validUntil: new Date('2026-04-01'),
    fareAmountLKR: 180,
    approvalStatus: 'Approved & Issued',
    qrCodeToken: 'GOLANKA-PASS-ANANDA-138-KM',
    createdAt: new Date('2026-01-01')
  },
  {
    _id: 'sp-demo-02',
    applicationNumber: 'GL-HI-345678',
    fullName: 'Dilani Sewwandi Perera',
    nicOrStudentId: '199878902345',
    contactNumber: '+94 71 890 1234',
    email: 'dilani.perera@uom.lk',
    passType: 'Higher Education / University',
    institutionOrEmployer: 'University of Moratuwa',
    routeNumber: '100',
    travelOrigin: 'Moratuwa Katubedda Junction',
    travelDestination: 'Colombo Fort / Galle Face',
    sltbDepotOffice: 'Moratuwa Depot',
    durationMonths: 6,
    validFrom: new Date('2026-02-01'),
    validUntil: new Date('2026-08-01'),
    fareAmountLKR: 650,
    approvalStatus: 'Approved & Issued',
    qrCodeToken: 'GOLANKA-PASS-UOM-100-DSP',
    createdAt: new Date('2026-02-01')
  }
];

// In-memory fallback storage if MongoDB is not connected
let activePasses = [...sampleSeasonPasses];

// 1. POST apply for digital season pass
router.post('/apply', async (req, res) => {
  try {
    const {
      fullName,
      nicOrStudentId,
      contactNumber,
      email,
      passType,
      institutionOrEmployer,
      routeNumber,
      travelOrigin,
      travelDestination,
      sltbDepotOffice,
      durationMonths = 1
    } = req.body;

    if (!fullName || !nicOrStudentId || !contactNumber || !routeNumber || !travelOrigin || !travelDestination) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory fields (Full Name, NIC/Student ID, Contact, Route, Origin, Destination)'
      });
    }

    // Dynamic fee estimation (subsidized for students in Sri Lanka)
    let baseRate = 120;
    if (passType === 'Higher Education / University') baseRate = 250;
    if (passType === 'Government Employee') baseRate = 450;
    if (passType === 'General Passenger') baseRate = 850;
    const fareAmountLKR = baseRate * Number(durationMonths);

    let savedPass = null;

    if (SeasonPass.db && SeasonPass.db.readyState === 1) {
      const pass = new SeasonPass({
        fullName,
        nicOrStudentId,
        contactNumber,
        email,
        passType,
        institutionOrEmployer,
        routeNumber,
        travelOrigin,
        travelDestination,
        sltbDepotOffice: sltbDepotOffice || 'Colombo Central Depot',
        durationMonths: Number(durationMonths),
        fareAmountLKR,
        approvalStatus: 'Approved & Issued' // Instant verification for demo/sandbox
      });
      savedPass = await pass.save();
    } else {
      // In-memory fallback
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const appNo = `GL-${(passType || 'GE').substring(0, 2).toUpperCase()}-${randomSuffix}`;
      const validFrom = new Date();
      const validUntil = new Date();
      validUntil.setMonth(validUntil.getMonth() + Number(durationMonths));

      savedPass = {
        _id: 'pass-' + Date.now(),
        applicationNumber: appNo,
        fullName,
        nicOrStudentId,
        contactNumber,
        email,
        passType,
        institutionOrEmployer,
        routeNumber,
        travelOrigin,
        travelDestination,
        sltbDepotOffice: sltbDepotOffice || 'Colombo Central Depot',
        durationMonths: Number(durationMonths),
        fareAmountLKR,
        approvalStatus: 'Approved & Issued',
        qrCodeToken: `GOLANKA-PASS-${randomSuffix}`,
        validFrom,
        validUntil,
        createdAt: new Date()
      };
      activePasses.unshift(savedPass);
    }

    res.status(201).json({
      success: true,
      message: 'Season Pass Application submitted and digital pass generated successfully!',
      data: savedPass
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. GET check pass status by NIC, Student ID, or Application Number
router.get('/status/:identifier', async (req, res) => {
  try {
    const ident = req.params.identifier.trim().toUpperCase();
    let result = null;

    if (SeasonPass.db && SeasonPass.db.readyState === 1) {
      result = await SeasonPass.findOne({
        $or: [
          { nicOrStudentId: ident },
          { applicationNumber: ident },
          { qrCodeToken: ident }
        ]
      });
    }

    if (!result) {
      result = activePasses.find(
        (p) =>
          p.nicOrStudentId.toUpperCase() === ident ||
          p.applicationNumber.toUpperCase() === ident ||
          p.qrCodeToken.toUpperCase() === ident
      );
    }

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `No active season pass found matching ID or Application Number: "${req.params.identifier}"`
      });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. GET verify QR token (Conductor validator endpoint)
router.get('/verify/:qrToken', async (req, res) => {
  try {
    const token = req.params.qrToken.trim();
    let pass = null;

    if (SeasonPass.db && SeasonPass.db.readyState === 1) {
      pass = await SeasonPass.findOne({ qrCodeToken: token });
    }

    if (!pass) {
      pass = activePasses.find((p) => p.qrCodeToken === token);
    }

    if (!pass) {
      return res.status(404).json({
        isValid: false,
        message: 'Invalid or counterfeit QR pass token'
      });
    }

    const isExpired = new Date(pass.validUntil) < new Date();
    res.json({
      isValid: !isExpired && pass.approvalStatus === 'Approved & Issued',
      isExpired,
      message: isExpired ? 'Pass has expired' : 'Valid Official goLanka Transit Pass',
      pass: {
        applicationNumber: pass.applicationNumber,
        passengerName: pass.fullName,
        nicOrStudentId: pass.nicOrStudentId,
        passType: pass.passType,
        routeNumber: pass.routeNumber,
        origin: pass.travelOrigin,
        destination: pass.travelDestination,
        validUntil: pass.validUntil
      }
    });
  } catch (error) {
    res.status(500).json({ isValid: false, message: error.message });
  }
});

// 4. GET list all passes (Admin overview)
router.get('/all', async (req, res) => {
  try {
    let list = [];
    if (SeasonPass.db && SeasonPass.db.readyState === 1) {
      list = await SeasonPass.find().sort({ createdAt: -1 });
    }
    if (!list || list.length === 0) {
      list = activePasses;
    }
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
