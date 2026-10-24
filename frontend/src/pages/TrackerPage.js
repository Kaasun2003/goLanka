import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LiveMap from '../components/LiveMap';

const popularRouteFilters = [
  { id: '', label: 'All Live Buses' },
  { id: '138', label: 'Route 138 (Pettah - Homagama)' },
  { id: '100', label: 'Route 100 (Pettah - Panadura)' },
  { id: '1', label: 'Route 1 (Colombo - Kandy)' },
  { id: 'EX-001', label: 'EX-001 (Southern Expressway)' }
];

const TrackerPage = ({ t }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRoute = searchParams.get('route') || '';
  const [selectedRoute, setSelectedRoute] = useState(initialRoute);
  const [isDriverSimulatorOpen, setIsDriverSimulatorOpen] = useState(false);
  const [simulatedCoords, setSimulatedCoords] = useState({ lat: 6.8649, lng: 79.8997 });

  useEffect(() => {
    const route = searchParams.get('route');
    if (route !== null) {
      setSelectedRoute(route);
    }
  }, [searchParams]);

  const handleFilterChange = (routeId) => {
    setSelectedRoute(routeId);
    if (routeId) {
      setSearchParams({ route: routeId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Live Fleet Tracking Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Sri Lanka Real-Time Bus Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time coordinates streamed from driver/conductor devices via Socket.io.
          </p>
        </div>

        {/* Action button for conductor / driver GPS simulation */}
        <button
          onClick={() => setIsDriverSimulatorOpen(!isDriverSimulatorOpen)}
          className="self-start md:self-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
        >
          <span>📱</span> Conductor GPS Simulator {isDriverSimulatorOpen ? '▲' : '▼'}
        </button>
      </div>

      {/* Driver/Conductor Simulation Drawer */}
      {isDriverSimulatorOpen && (
        <div className="bg-slate-900 border border-amber-400/40 rounded-2xl p-5 shadow-2xl animate-fadeIn space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📡</span>
              <div>
                <h3 className="text-sm font-bold text-white">Driver / Conductor Smartphone GPS Transmitter</h3>
                <p className="text-xs text-slate-400">Simulate broadcasting live coordinates from a bus handset</p>
              </div>
            </div>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded font-mono">
              Throttled: 5s Intervals
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1">Assigned Route:</span>
              <strong className="text-white font-mono">Route 138 (Bus WP ND-7821)</strong>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1">Current Latitude:</span>
              <strong className="text-emerald-400 font-mono">{simulatedCoords.lat.toFixed(4)}° N</strong>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1">Current Longitude:</span>
              <strong className="text-emerald-400 font-mono">{simulatedCoords.lng.toFixed(4)}° E</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSimulatedCoords((prev) => ({
                  lat: prev.lat + 0.0012,
                  lng: prev.lng + 0.0015
                }));
              }}
              className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-300 transition-colors"
            >
              🚀 Step Forward GPS Location
            </button>
            <span className="text-[11px] text-slate-400">
              Updates broadcasted across all connected passenger Leaflet screens in real time.
            </span>
          </div>
        </div>
      )}

      {/* Filter Badges Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 mr-1">Corridor Filter:</span>
        {popularRouteFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterChange(filter.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedRoute === filter.id
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Embedded Live Interactive Leaflet Map */}
      <div className="w-full">
        <LiveMap selectedRouteFilter={selectedRoute} t={t} />
      </div>

      {/* Quick Corridor Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs">
          <span className="font-bold text-white block mb-1">⚡ High-Frequency 138 Corridor</span>
          <p className="text-slate-400">
            Pettah to Maharagama & Homagama operates every 8-10 mins with over 45 active buses during peak morning & evening hours.
          </p>
        </div>
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs">
          <span className="font-bold text-white block mb-1">🌊 Coastal Line 100 Corridor</span>
          <p className="text-slate-400">
            Colombo Fort along Galle Road down to Mount Lavinia, Moratuwa, and Panadura with full GPS telemetry.
          </p>
        </div>
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs">
          <span className="font-bold text-white block mb-1">🛡️ Mountain Pass Drop Recovery</span>
          <p className="text-slate-400">
            Route 1 buses around Kadugannawa slope auto-switch to "Last Known Location" to maintain ETA integrity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackerPage;
