# 🇱🇰 goLanka - Sri Lankan Digital Bus Transit Web Application

**goLanka** (ලංකා බස් සේවය) is an integrated, full-stack digital transit web platform designed specifically for the public and private bus transportation ecosystem in Sri Lanka. It combines real-time GPS fleet tracking, intelligent journey planning, digital season pass applications with QR verification, seat reservation redirects, and trilingual accessibility (English, සිංහල, தமிழ்).

---

## 🌟 Key Features

1. **Real-time Live Bus Tracking (Leaflet & Socket.io)**
   - Live GPS tracking of buses along popular Sri Lankan routes (e.g., Route 138 Pettah - Homagama, Route 100 Panadura, Route 1 Kandy).
   - Low-latency WebSocket updates using Socket.io.
   - Offline & network-resilient "Last Known Location" marker handling for connectivity dropouts in rural areas.
   - Throttled GPS updates (5–10s intervals) for driver mobile battery optimization.

2. **Smart Journey Planner & Timetable Search**
   - Search routes by bus number, start depot, destination, or intermediate stops.
   - Estimated Travel Time (ETA), stop sequences, fare tier approximations, and transit schedules.
   - Filter by bus category: SLTB (CTB), Private Normal, Semi-Luxury, Luxury AC, and Southern Expressway (EX-001) coaches.

3. **Digital Season Pass System (වාර ප්‍රවේශපත්‍ර)**
   - Online application for School / University Students, Government Servants, and Private Sector commuters.
   - Digital QR-code season pass generation for contact-free scanning by bus conductors.
   - Real-time application status tracker (Pending, Verified, Active, Expired).

4. **Intercity Seat Booking Hub**
   - Centralized aggregation gateway linking passengers to official long-distance booking portals:
     - **SLTB e-Sheet** (`eservices.sltb.lk`)
     - **NCG Express**
     - **Magiya Transit Portal**
     - **BusSeat.lk**

5. **Trilingual Localization (සිංහල | English | தமிழ்)**
   - Seamless language switcher for passenger inclusivity across all Sri Lankan provinces.

---

## 📂 Project Structure

```text
goLanka/
├── README.md
├── backend/
│   ├── .env
│   ├── package.json
│   ├── server.js
│   ├── models/
│   │   ├── Route.js          # Route paths, start/end, and intermediate stages
│   │   ├── Bus.js            # Vehicle registration, driver info, live status
│   │   └── SeasonPass.js     # Season pass requests, QR token & passenger info
│   └── routes/
│       ├── busRoutes.js      # Search, routes listing, and timetable APIs
│       └── seasonRoutes.js   # Season pass submit, verify & list endpoints
└── frontend/
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── public/
    │   ├── index.html
    │   ├── manifest.json
    │   └── logo.jpg
    └── src/
        ├── index.js
        ├── index.css
        ├── App.js
        ├── components/
        │   ├── Navbar.js           # Header with language switcher (EN/SI/TA)
        │   ├── Footer.js           # Footer links and transit helpline info
        │   ├── JourneyPlanner.js   # Origin-Destination search and schedule cards
        │   ├── LiveMap.js          # Leaflet map with simulated GPS markers
        │   ├── SeatBookingHub.js   # Direct links to SLTB e-Sheet, NCG, Magiya
        │   └── SeasonPassForm.js   # Digital pass registration form with QR view
        └── pages/
            ├── Home.js             # Hero landing, quick search & highlights
            ├── TrackerPage.js      # Full-screen live tracking and bus filters
            └── SeasonPage.js       # Season pass portal and digital card display
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster URI)
- [npm](https://www.npmjs.com/) or `yarn`

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file if necessary:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/golanka

# Start the server (Development mode)
npm run dev

# Or Production mode
npm start
```
The backend server will start on `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```
The client application will run at `http://localhost:3000`.

---

## 📡 Real-Time Socket.io Events

| Event Name | Direction | Payload | Description |
|---|---|---|---|
| `join-bus-room` | Client ➡️ Server | `{ busId: string }` | Subscribe to live updates for a specific bus. |
| `update-location` | Conductor/Driver ➡️ Server | `{ busId, lat, lng, speed, heading }` | Push GPS coordinates from driver's mobile. |
| `bus-location-changed` | Server ➡️ Client | `{ busId, lat, lng, speed, lastUpdated }` | Broadcast new bus coordinates to connected passengers. |
| `passenger-alert` | Server ➡️ Client | `{ busId, message, type }` | Broadcast route delay or emergency notification. |

---

## 🔌 Core API Endpoints

### Bus & Route Endpoints (`/api/buses`)
- `GET /api/buses/routes` - Retrieve all available bus routes.
- `GET /api/buses/routes/search?from=Pettah&to=Kandy` - Search routes by origin and destination.
- `GET /api/buses/live` - Retrieve all active buses currently sharing live GPS coordinates.
- `GET /api/buses/:id` - Get specific bus details and route info.

### Season Pass Endpoints (`/api/season`)
- `POST /api/season/apply` - Submit a new passenger/student season pass application.
- `GET /api/season/status/:nic` - Check season pass status using National Identity Card (NIC) or Student ID.
- `GET /api/season/verify/:qrToken` - Verify a season pass token (used by conductors).

---

## 🇱🇰 Designed for Sri Lanka Transit Conditions
- **Network Resilience:** Handles 3G/4G network dropouts between mountainous passes (e.g. Kadugannawa, Ella) by displaying "Last Known Location" with time elapsed indicators.
- **Battery Optimization:** GPS transmissions are batched every 5 to 10 seconds to conserve battery on driver smartphones.
- **Multilingual Support:** First-class support for Sinhala, Tamil, and English.

---

## 📜 License
This project is open-source and licensed under the [MIT License](LICENSE).
