import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Bus Icon Creator using HTML DivIcon for sleek glowing markers
const createBusIcon = (routeNumber, isSignalLost = false) => {
  const bgColor = isSignalLost ? '#e11d48' : '#f59e0b';
  return L.divIcon({
    className: 'custom-bus-icon',
    html: `
      <div style="
        background: ${bgColor};
        color: #0f172a;
        font-weight: 900;
        font-family: monospace;
        font-size: 11px;
        padding: 4px 7px;
        border-radius: 9999px;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 14px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        gap: 3px;
        white-space: nowrap;
        transform: translate(-50%, -50%);
      ">
        <span>🚌</span>
        <span>${routeNumber}</span>
      </div>
    `,
    iconSize: [40, 24],
    iconAnchor: [20, 12]
  });
};

// Initial Active Buses along major Sri Lankan corridors
const initialBuses = [
  {
    busId: 'bus-138-alpha',
    registrationNumber: 'WP ND-7821',
    routeNumber: '138',
    routeName: 'Colombo (Pettah) - Maharagama / Homagama',
    lat: 6.8649,
    lng: 79.8997,
    speedKmH: 34,
    driver: 'Sunil Weerasinghe',
    conductor: 'Kamal Bandara',
    nextStop: 'Delkanda Junction',
    etaMins: 4,
    busType: 'SLTB Standard Depot Bus',
    isSignalLost: false
  },
  {
    busId: 'bus-100-beta',
    registrationNumber: 'WP NA-4439',
    routeNumber: '100',
    routeName: 'Colombo (Pettah) - Panadura',
    lat: 6.8517,
    lng: 79.8659,
    speedKmH: 42,
    driver: 'Priyantha Jayakody',
    conductor: 'Dhammika Perera',
    nextStop: 'Mount Lavinia Hotel Road',
    etaMins: 7,
    busType: 'Private Semi-Luxury',
    isSignalLost: false
  },
  {
    busId: 'bus-01-gamma',
    registrationNumber: 'CP NC-9012',
    routeNumber: '1',
    routeName: 'Colombo (Pettah) - Kandy Goods Shed',
    lat: 7.2255,
    lng: 80.2005,
    speedKmH: 48,
    driver: 'Anura Kumara Dissanayake',
    conductor: 'Wasantha Senanayake',
    nextStop: 'Warakapola Town',
    etaMins: 12,
    busType: 'SLTB Long Distance',
    isSignalLost: true // Demonstrates mountain signal fluctuation resilience
  },
  {
    busId: 'bus-ex-delta',
    registrationNumber: 'SP ND-5520',
    routeNumber: 'EX-001',
    routeName: 'Makumbura (Kottawa) - Galle Central (Expressway)',
    lat: 6.4528,
    lng: 80.0880,
    speedKmH: 86,
    driver: 'Rohana Samarasinghe',
    conductor: 'Nimal Karunaratne',
    nextStop: 'Kurundugahahetekma Interchange',
    etaMins: 22,
    busType: 'Southern Expressway Super Luxury Coach',
    isSignalLost: false
  }
];

// Sample Route Polyline coords for visual demonstration (Route 138 Corridor)
const route138Polyline = [
  [6.9366, 79.8532], // Pettah
  [6.9271, 79.8667], // Maradana
  [6.9147, 79.8777], // Borella
  [6.8927, 79.8828], // Narahenpita
  [6.8649, 79.8997], // Nugegoda
  [6.8584, 79.9126], // Delkanda
  [6.8480, 79.9268], // Maharagama
  [6.8411, 79.9654], // Kottawa
  [6.8415, 80.0035]  // Homagama
];

const LiveMap = ({ selectedRouteFilter = '', t }) => {
  const [buses, setBuses] = useState(initialBuses);
  const [selectedBus, setSelectedBus] = useState(initialBuses[0]);
  const [isLiveActive, setIsLiveActive] = useState(true);

  // Dynamic simulation loop: moves buses realistically along roads
  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          // Micro step movement
          const randomLatDelta = (Math.random() - 0.48) * 0.0015;
          const randomLngDelta = (Math.random() - 0.48) * 0.0015;
          const speedVariation = Math.floor(25 + Math.random() * 35);

          return {
            ...bus,
            lat: Number((bus.lat + randomLatDelta).toFixed(5)),
            lng: Number((bus.lng + randomLngDelta).toFixed(5)),
            speedKmH: bus.routeNumber === 'EX-001' ? 85 : speedVariation,
            lastPing: new Date().toLocaleTimeString()
          };
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  const filteredBuses = buses.filter((b) =>
    !selectedRouteFilter ? true : b.routeNumber.toLowerCase().includes(selectedRouteFilter.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Top Map Control Bar */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            {t?.liveTrackingNow || 'Live Bus Fleet Radar'}
          </span>
          <span className="text-xs font-mono bg-slate-800 text-amber-400 px-2 py-0.5 rounded border border-slate-700">
            {filteredBuses.length} Buses Transmitting
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setIsLiveActive(!isLiveActive)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              isLiveActive
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-red-500/20 text-red-300 border border-red-500/40'
            }`}
          >
            {isLiveActive ? '● Streaming GPS' : '❚❚ Paused'}
          </button>
        </div>
      </div>

      {/* Map Canvas and Overlay Panel */}
      <div className="relative w-full h-[520px] sm:h-[620px]">
        <MapContainer
          center={[6.8700, 79.9300]}
          zoom={11}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          {/* CartoDB Dark Matter tiles for modern high-contrast aesthetic */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Polyline for High-Density Route 138 Corridor */}
          <Polyline
            positions={route138Polyline}
            pathOptions={{ color: '#f59e0b', weight: 4, opacity: 0.8, dashArray: '8, 8' }}
          />

          {/* Live Bus Markers */}
          {filteredBuses.map((bus) => (
            <Marker
              key={bus.busId}
              position={[bus.lat, bus.lng]}
              icon={createBusIcon(bus.routeNumber, bus.isSignalLost)}
              eventHandlers={{
                click: () => setSelectedBus(bus)
              }}
            >
              <Popup>
                <div className="p-1 space-y-2 text-xs font-sans text-slate-100 min-w-[200px]">
                  <div className="flex justify-between items-center border-b border-slate-700 pb-1.5">
                    <span className="font-bold text-amber-400 font-mono text-sm">
                      Route {bus.routeNumber}
                    </span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono">
                      {bus.registrationNumber}
                    </span>
                  </div>

                  <p className="font-semibold text-slate-200">{bus.routeName}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/80 p-2 rounded">
                    <div>
                      <span className="text-slate-400 block">Speed:</span>
                      <span className="font-mono font-bold text-emerald-400">{bus.speedKmH} km/h</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Next Stop:</span>
                      <span className="font-bold text-white">{bus.nextStop}</span>
                    </div>
                  </div>

                  {bus.isSignalLost && (
                    <div className="text-[10px] bg-rose-950/80 text-rose-300 border border-rose-800 p-1 rounded">
                      ⚠️ Low 3G Signal: Showing Last Known Location
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Bus Details HUD */}
        {selectedBus && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-96 z-[1000] bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl transition-all">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-mono font-black text-xs rounded">
                  Route {selectedBus.routeNumber}
                </span>
                <span className="font-mono text-xs font-bold text-slate-300">
                  {selectedBus.registrationNumber}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                selectedBus.isSignalLost
                  ? 'bg-red-500/10 text-red-400 border-red-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                {selectedBus.isSignalLost ? 'Last Known Location' : 'Live GPS Connected'}
              </span>
            </div>

            <p className="text-xs font-bold text-white mb-2 leading-snug">
              {selectedBus.routeName}
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 mb-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Speed</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {selectedBus.speedKmH} <span className="text-[10px] text-slate-400 font-normal">km/h</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">ETA</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ~{selectedBus.etaMins} <span className="text-[10px] text-slate-400 font-normal">mins</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Driver</span>
                <span className="font-medium text-slate-200 text-xs truncate block">
                  {selectedBus.driver.split(' ')[0]}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Next: <strong className="text-white">{selectedBus.nextStop}</strong></span>
              <span className="text-[10px] font-mono text-slate-500">Updated: Just now</span>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="bg-slate-900/90 px-4 py-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
            Active Bus Marker
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
            Signal Drop Recovery
          </span>
          <span className="flex items-center gap-1.5 hidden sm:inline-flex">
            <span className="w-6 h-0.5 bg-amber-400 border-dashed inline-block"></span>
            Designated Route Corridor
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          Powered by Leaflet.js & OpenStreetMap
        </span>
      </div>
    </div>
  );
};

export default LiveMap;
