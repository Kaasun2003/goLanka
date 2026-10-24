const express = require('express');
const router = express.Router();
const Route = require('../models/Route');
const Bus = require('../models/Bus');

// Built-in Sri Lankan default transit routes (used as initial dataset or fallback)
const defaultSriLankaRoutes = [
  {
    _id: 'route-138-01',
    routeNumber: '138',
    routeName: 'Colombo (Pettah) - Maharagama / Homagama',
    category: 'Normal',
    operator: 'Joint Service',
    startLocation: {
      name: 'Pettah Central Bus Stand',
      nameSinhala: 'පිටකොටුව මධ්‍යම බස් නැවතුම්පොළ',
      nameTamil: 'புறக்கோட்டை மத்திய பேருந்து நிலையம்',
      city: 'Colombo',
      coordinates: { lat: 6.9366, lng: 79.8532 }
    },
    endLocation: {
      name: 'Homagama Bus Depot',
      nameSinhala: 'හෝමාගම බස් නැවතුම',
      nameTamil: 'ஹோமாகம பேருந்து நிலையம்',
      city: 'Homagama',
      coordinates: { lat: 6.8415, lng: 80.0035 }
    },
    intermediateStops: [
      { stopName: 'Pettah', order: 1, coordinates: { lat: 6.9366, lng: 79.8532 }, estimatedTimeMins: 0 },
      { stopName: 'Maradana', order: 2, coordinates: { lat: 6.9271, lng: 79.8667 }, estimatedTimeMins: 10 },
      { stopName: 'Borella', order: 3, coordinates: { lat: 6.9147, lng: 79.8777 }, estimatedTimeMins: 20 },
      { stopName: 'Narahenpita', order: 4, coordinates: { lat: 6.8927, lng: 79.8828 }, estimatedTimeMins: 32 },
      { stopName: 'Nugegoda', order: 5, coordinates: { lat: 6.8649, lng: 79.8997 }, estimatedTimeMins: 45 },
      { stopName: 'Delkanda', order: 6, coordinates: { lat: 6.8584, lng: 79.9126 }, estimatedTimeMins: 52 },
      { stopName: 'Maharagama', order: 7, coordinates: { lat: 6.8480, lng: 79.9268 }, estimatedTimeMins: 62 },
      { stopName: 'Kottawa', order: 8, coordinates: { lat: 6.8411, lng: 79.9654 }, estimatedTimeMins: 75 },
      { stopName: 'Makumbura Multimodal Hub', order: 9, coordinates: { lat: 6.8406, lng: 79.9806 }, estimatedTimeMins: 82 },
      { stopName: 'Homagama', order: 10, coordinates: { lat: 6.8415, lng: 80.0035 }, estimatedTimeMins: 95 }
    ],
    distanceKm: 24.5,
    approxDurationMins: 85,
    fareRange: { minLKR: 38, maxLKR: 145 },
    frequencyMins: 10,
    firstBusTime: '04:30 AM',
    lastBusTime: '11:45 PM'
  },
  {
    _id: 'route-100-02',
    routeNumber: '100',
    routeName: 'Colombo (Pettah) - Moratuwa / Panadura',
    category: 'Normal',
    operator: 'Joint Service',
    startLocation: {
      name: 'Pettah Bastian Mawatha',
      nameSinhala: 'බැස්ටියන් මාවත',
      nameTamil: 'பாஸ்டியன் மாவத்தை',
      city: 'Colombo',
      coordinates: { lat: 6.9355, lng: 79.8550 }
    },
    endLocation: {
      name: 'Panadura Bus Stand',
      nameSinhala: 'පානදුර බස් නැවතුම',
      nameTamil: 'பாணந்துறை பேருந்து நிலையம்',
      city: 'Panadura',
      coordinates: { lat: 6.7132, lng: 79.9074 }
    },
    intermediateStops: [
      { stopName: 'Pettah', order: 1, coordinates: { lat: 6.9355, lng: 79.8550 }, estimatedTimeMins: 0 },
      { stopName: 'Galle Face', order: 2, coordinates: { lat: 6.9270, lng: 79.8450 }, estimatedTimeMins: 8 },
      { stopName: 'Kollupitiya', order: 3, coordinates: { lat: 6.9115, lng: 79.8507 }, estimatedTimeMins: 18 },
      { stopName: 'Bambalapitiya', order: 4, coordinates: { lat: 6.8938, lng: 79.8555 }, estimatedTimeMins: 26 },
      { stopName: 'Wellawatte', order: 5, coordinates: { lat: 6.8741, lng: 79.8606 }, estimatedTimeMins: 35 },
      { stopName: 'Dehiwala', order: 6, coordinates: { lat: 6.8517, lng: 79.8659 }, estimatedTimeMins: 45 },
      { stopName: 'Mount Lavinia', order: 7, coordinates: { lat: 6.8373, lng: 79.8660 }, estimatedTimeMins: 55 },
      { stopName: 'Ratmalana', order: 8, coordinates: { lat: 6.8184, lng: 79.8727 }, estimatedTimeMins: 65 },
      { stopName: 'Moratuwa', order: 9, coordinates: { lat: 6.7744, lng: 79.8826 }, estimatedTimeMins: 80 },
      { stopName: 'Panadura', order: 10, coordinates: { lat: 6.7132, lng: 79.9074 }, estimatedTimeMins: 105 }
    ],
    distanceKm: 27.8,
    approxDurationMins: 90,
    fareRange: { minLKR: 38, maxLKR: 160 },
    frequencyMins: 8,
    firstBusTime: '04:45 AM',
    lastBusTime: '11:30 PM'
  },
  {
    _id: 'route-01-03',
    routeNumber: '1',
    routeName: 'Colombo (Pettah) - Kandy (Goods Shed)',
    category: 'Semi-Luxury',
    operator: 'SLTB',
    startLocation: {
      name: 'Colombo Central Bus Stand (Pettah)',
      nameSinhala: 'පිටකොටුව',
      nameTamil: 'புறக்கோட்டை',
      city: 'Colombo',
      coordinates: { lat: 6.9366, lng: 79.8532 }
    },
    endLocation: {
      name: 'Kandy Goods Shed Bus Stand',
      nameSinhala: 'මහනුවර ගුඩ් ෂෙඩ් නැවතුම',
      nameTamil: 'கண்டி பேருந்து நிலையம்',
      city: 'Kandy',
      coordinates: { lat: 7.2906, lng: 80.6337 }
    },
    intermediateStops: [
      { stopName: 'Pettah', order: 1, coordinates: { lat: 6.9366, lng: 79.8532 }, estimatedTimeMins: 0 },
      { stopName: 'Peliyagoda', order: 2, coordinates: { lat: 6.9632, lng: 79.8856 }, estimatedTimeMins: 20 },
      { stopName: 'Kiribathgoda', order: 3, coordinates: { lat: 6.9790, lng: 79.9280 }, estimatedTimeMins: 35 },
      { stopName: 'Nittambuwa', order: 4, coordinates: { lat: 7.1438, lng: 80.1170 }, estimatedTimeMins: 70 },
      { stopName: 'Warakapola', order: 5, coordinates: { lat: 7.2255, lng: 80.2005 }, estimatedTimeMins: 105 },
      { stopName: 'Kegalle', order: 6, coordinates: { lat: 7.2513, lng: 80.3464 }, estimatedTimeMins: 140 },
      { stopName: 'Mawanella', order: 7, coordinates: { lat: 7.2528, lng: 80.4501 }, estimatedTimeMins: 165 },
      { stopName: 'Kadugannawa Pass', order: 8, coordinates: { lat: 7.2562, lng: 80.5222 }, estimatedTimeMins: 190 },
      { stopName: 'Peradeniya', order: 9, coordinates: { lat: 7.2657, lng: 80.5968 }, estimatedTimeMins: 210 },
      { stopName: 'Kandy Central', order: 10, coordinates: { lat: 7.2906, lng: 80.6337 }, estimatedTimeMins: 225 }
    ],
    distanceKm: 115.0,
    approxDurationMins: 210,
    fareRange: { minLKR: 450, maxLKR: 780 },
    frequencyMins: 20,
    firstBusTime: '04:00 AM',
    lastBusTime: '10:00 PM'
  },
  {
    _id: 'route-ex001-04',
    routeNumber: 'EX-001',
    routeName: 'Makumbura (Kottawa) - Galle (Southern Expressway)',
    category: 'Highway Express',
    operator: 'SLTB',
    startLocation: {
      name: 'Makumbura Multimodal Transport Hub',
      nameSinhala: 'මාකුඹුර බහුවිධ ප්‍රවාහන මධ්‍යස්ථානය',
      nameTamil: 'மாகும்பூர பல்துறை போக்குவரத்து மையம்',
      city: 'Kottawa',
      coordinates: { lat: 6.8406, lng: 79.9806 }
    },
    endLocation: {
      name: 'Galle Central Bus Stand',
      nameSinhala: 'ගාල්ල මධ්‍යම බස් නැවතුම',
      nameTamil: 'காலி பேருந்து நிலையம்',
      city: 'Galle',
      coordinates: { lat: 6.0367, lng: 80.2170 }
    },
    intermediateStops: [
      { stopName: 'Makumbura MTH', order: 1, coordinates: { lat: 6.8406, lng: 79.9806 }, estimatedTimeMins: 0 },
      { stopName: 'Dodangoda Interchange', order: 2, coordinates: { lat: 6.6112, lng: 80.0520 }, estimatedTimeMins: 25 },
      { stopName: 'Welipenna Service Area', order: 3, coordinates: { lat: 6.4528, lng: 80.0880 }, estimatedTimeMins: 40 },
      { stopName: 'Kurundugahahetekma', order: 4, coordinates: { lat: 6.3015, lng: 80.1250 }, estimatedTimeMins: 55 },
      { stopName: 'Pinnaduwa Interchange', order: 5, coordinates: { lat: 6.0682, lng: 80.2520 }, estimatedTimeMins: 75 },
      { stopName: 'Galle Central', order: 6, coordinates: { lat: 6.0367, lng: 80.2170 }, estimatedTimeMins: 85 }
    ],
    distanceKm: 104.0,
    approxDurationMins: 85,
    fareRange: { minLKR: 750, maxLKR: 950 },
    frequencyMins: 30,
    firstBusTime: '06:00 AM',
    lastBusTime: '09:00 PM'
  }
];

// Seed active buses with simulated GPS coordinates along Sri Lankan corridors
const defaultLiveBuses = [
  {
    _id: 'bus-138-alpha',
    registrationNumber: 'WP ND-7821',
    routeNumber: '138',
    busType: 'SLTB Standard',
    operatorType: 'SLTB',
    driverDetails: {
      name: 'Sunil Weerasinghe',
      contactNumber: '+94 77 123 4567',
      conductorName: 'Kamal Bandara'
    },
    currentStatus: 'In Transit',
    currentLocation: {
      lat: 6.8649,
      lng: 79.8997,
      speedKmH: 34,
      headingDegrees: 125,
      lastUpdated: new Date()
    },
    nextStop: 'Delkanda',
    etaToNextStopMins: 6,
    isSignalLost: false
  },
  {
    _id: 'bus-100-beta',
    registrationNumber: 'WP NA-4439',
    routeNumber: '100',
    busType: 'Private Normal',
    operatorType: 'Private Operator',
    driverDetails: {
      name: 'Priyantha Jayakody',
      contactNumber: '+94 71 987 6543',
      conductorName: 'Dhammika Perera'
    },
    currentStatus: 'In Transit',
    currentLocation: {
      lat: 6.8517,
      lng: 79.8659,
      speedKmH: 42,
      headingDegrees: 180,
      lastUpdated: new Date()
    },
    nextStop: 'Mount Lavinia',
    etaToNextStopMins: 9,
    isSignalLost: false
  },
  {
    _id: 'bus-01-gamma',
    registrationNumber: 'CP NC-9012',
    routeNumber: '1',
    busType: 'Semi-Luxury',
    operatorType: 'SLTB',
    driverDetails: {
      name: 'Anura Kumara Dissanayake',
      contactNumber: '+94 76 555 4321',
      conductorName: 'Wasantha Senanayake'
    },
    currentStatus: 'In Transit',
    currentLocation: {
      lat: 7.2255,
      lng: 80.2005,
      speedKmH: 48,
      headingDegrees: 45,
      lastUpdated: new Date()
    },
    nextStop: 'Kegalle Central',
    etaToNextStopMins: 18,
    isSignalLost: false
  },
  {
    _id: 'bus-ex-delta',
    registrationNumber: 'SP ND-5520',
    routeNumber: 'EX-001',
    busType: 'Highway Express',
    operatorType: 'SLTB',
    driverDetails: {
      name: 'Rohana Samarasinghe',
      contactNumber: '+94 70 888 1234',
      conductorName: 'Nimal Karunaratne'
    },
    currentStatus: 'In Transit',
    currentLocation: {
      lat: 6.4528,
      lng: 80.0880,
      speedKmH: 85,
      headingDegrees: 165,
      lastUpdated: new Date()
    },
    nextStop: 'Pinnaduwa Galle Exit',
    etaToNextStopMins: 32,
    isSignalLost: false
  }
];

// 1. GET all routes
router.get('/routes', async (req, res) => {
  try {
    let routes = [];
    if (Route.db && Route.db.readyState === 1) {
      routes = await Route.find({ isActive: true });
    }
    if (!routes || routes.length === 0) {
      routes = defaultSriLankaRoutes;
    }
    res.json({ success: true, count: routes.length, data: routes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: defaultSriLankaRoutes });
  }
});

// 2. SEARCH routes by from, to, and routeNumber
router.get('/routes/search', async (req, res) => {
  try {
    const { from, to, routeNumber } = req.query;
    let pool = defaultSriLankaRoutes;

    if (Route.db && Route.db.readyState === 1) {
      const dbRoutes = await Route.find();
      if (dbRoutes && dbRoutes.length > 0) {
        pool = dbRoutes;
      }
    }

    let results = pool;

    if (routeNumber) {
      results = results.filter((r) =>
        r.routeNumber.toLowerCase().includes(routeNumber.toLowerCase().trim())
      );
    }

    if (from) {
      const q = from.toLowerCase().trim();
      results = results.filter(
        (r) =>
          r.startLocation.name.toLowerCase().includes(q) ||
          r.startLocation.city.toLowerCase().includes(q) ||
          (r.intermediateStops && r.intermediateStops.some((s) => s.stopName.toLowerCase().includes(q)))
      );
    }

    if (to) {
      const q = to.toLowerCase().trim();
      results = results.filter(
        (r) =>
          r.endLocation.name.toLowerCase().includes(q) ||
          r.endLocation.city.toLowerCase().includes(q) ||
          (r.intermediateStops && r.intermediateStops.some((s) => s.stopName.toLowerCase().includes(q)))
      );
    }

    res.json({
      success: true,
      query: { from, to, routeNumber },
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. GET all active buses for live map tracking
router.get('/live', async (req, res) => {
  try {
    let buses = [];
    if (Bus.db && Bus.db.readyState === 1) {
      buses = await Bus.find({ isLiveTrackingActive: true }).populate('assignedRoute');
    }
    if (!buses || buses.length === 0) {
      buses = defaultLiveBuses;
    }
    res.json({ success: true, count: buses.length, data: buses });
  } catch (error) {
    res.json({ success: true, count: defaultLiveBuses.length, data: defaultLiveBuses });
  }
});

// 4. GET specific route by ID
router.get('/routes/:id', async (req, res) => {
  try {
    let route = null;
    if (Route.db && Route.db.readyState === 1) {
      route = await Route.findById(req.params.id);
    }
    if (!route) {
      route = defaultSriLankaRoutes.find((r) => r._id === req.params.id || r.routeNumber === req.params.id);
    }
    if (!route) {
      return res.status(404).json({ success: false, message: 'Transit route not found' });
    }
    res.json({ success: true, data: route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. POST new route (Admin entry)
router.post('/routes', async (req, res) => {
  try {
    const newRoute = new Route(req.body);
    const saved = await newRoute.save();
    res.status(201).json({ success: true, message: 'Bus route registered successfully', data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 6. POST new bus (Admin/Depot entry)
router.post('/buses', async (req, res) => {
  try {
    const newBus = new Bus(req.body);
    const saved = await newBus.save();
    res.status(201).json({ success: true, message: 'Bus registered successfully', data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;
