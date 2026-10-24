const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/golanka';

// Setup Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for dev or specify CLIENT_ORIGIN
    methods: ['GET', 'POST', 'PUT']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection with graceful fallback
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ [MongoDB] Connected to goLanka database successfully.');
  })
  .catch((err) => {
    console.warn('⚠️ [MongoDB] Warning: Could not connect to MongoDB:', err.message);
    console.log('ℹ️ [goLanka] Running in high-performance in-memory sandbox mode.');
  });

// API Routes
const busRoutes = require('./routes/busRoutes');
const seasonRoutes = require('./routes/seasonRoutes');

app.use('/api/buses', busRoutes);
app.use('/api/season', seasonRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'goLanka Transit API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Simulated bus coordinates for demo live movement along Sri Lankan corridors
const simulatedBuses = [
  {
    busId: 'bus-138-alpha',
    registrationNumber: 'WP ND-7821',
    routeNumber: '138',
    lat: 6.8649,
    lng: 79.8997,
    deltaLat: -0.0004,
    deltaLng: 0.0006,
    speed: 36,
    direction: 'Homagama'
  },
  {
    busId: 'bus-100-beta',
    registrationNumber: 'WP NA-4439',
    routeNumber: '100',
    lat: 6.8517,
    lng: 79.8659,
    deltaLat: -0.0005,
    deltaLng: 0.0001,
    speed: 40,
    direction: 'Panadura'
  },
  {
    busId: 'bus-01-gamma',
    registrationNumber: 'CP NC-9012',
    routeNumber: '1',
    lat: 7.2255,
    lng: 80.2005,
    deltaLat: 0.0003,
    deltaLng: 0.0008,
    speed: 48,
    direction: 'Kandy'
  }
];

// Socket.io Real-Time Tracking Engine
io.on('connection', (socket) => {
  console.log(`🔌 [Socket.io] New client connected: ${socket.id}`);

  // Send current active bus positions immediately upon connection
  socket.emit('initial-bus-locations', simulatedBuses);

  // Passenger joins a specific bus or route room for fine-grained updates
  socket.on('join-bus-room', ({ busId, routeNumber }) => {
    const room = busId ? `bus-${busId}` : `route-${routeNumber}`;
    socket.join(room);
    console.log(`📡 [Socket.io] Client ${socket.id} joined room: ${room}`);
  });

  // Conductor / Driver Mobile App transmits live GPS coordinates
  socket.on('update-location', (data) => {
    const { busId, routeNumber, lat, lng, speed, heading, isSignalLost } = data;
    const updatePayload = {
      busId,
      routeNumber,
      lat,
      lng,
      speed: speed || 0,
      heading: heading || 0,
      isSignalLost: !!isSignalLost,
      lastUpdated: new Date()
    };

    // Broadcast to the specific bus room and all global map subscribers
    io.to(`bus-${busId}`).emit('bus-location-changed', updatePayload);
    io.emit('bus-location-changed', updatePayload);
  });

  // Driver or dispatcher sends passenger advisory / delay alert
  socket.on('dispatch-alert', (alert) => {
    io.emit('passenger-alert', {
      ...alert,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log(`🔌 [Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Auto-simulation interval: Updates bus GPS coordinates every 4 seconds
// to provide a dynamic live map experience out-of-the-box
setInterval(() => {
  simulatedBuses.forEach((bus) => {
    bus.lat += bus.deltaLat;
    bus.lng += bus.deltaLng;
    // Boundary bounds bounce simulation
    if (bus.lat < 6.75 || bus.lat > 7.35) bus.deltaLat *= -1;
    if (bus.lng < 79.80 || bus.lng > 80.65) bus.deltaLng *= -1;

    io.emit('bus-location-changed', {
      busId: bus.busId,
      registrationNumber: bus.registrationNumber,
      routeNumber: bus.routeNumber,
      lat: bus.lat,
      lng: bus.lng,
      speedKmH: Math.floor(30 + Math.random() * 25),
      lastUpdated: new Date()
    });
  });
}, 4000);

// Root route
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 2rem; background: #0f172a; color: #f8fafc; min-height: 100vh;">
      <h1 style="color: #38bdf8;">🇱🇰 goLanka Transit API & Real-time Server</h1>
      <p>Node.js, Express, and Socket.io tracking server is operational.</p>
      <ul>
        <li>Routes API: <a style="color: #38bdf8;" href="/api/buses/routes">/api/buses/routes</a></li>
        <li>Live Buses: <a style="color: #38bdf8;" href="/api/buses/live">/api/buses/live</a></li>
        <li>Season Pass Status: <a style="color: #38bdf8;" href="/api/season/all">/api/season/all</a></li>
      </ul>
    </div>
  `);
});

server.listen(PORT, () => {
  console.log(`🚀 [goLanka Server] Running on http://localhost:${PORT}`);
  console.log(`🛰️ [goLanka Socket.io] Real-time tracking engine listening on port ${PORT}`);
});
