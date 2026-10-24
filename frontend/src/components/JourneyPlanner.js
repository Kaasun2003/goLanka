import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const sampleRoutesFallback = [
  {
    _id: 'route-138-01',
    routeNumber: '138',
    routeName: 'Colombo (Pettah) - Maharagama / Homagama',
    category: 'Normal',
    operator: 'Joint Service',
    startLocation: { name: 'Pettah Central Bus Stand', city: 'Colombo' },
    endLocation: { name: 'Homagama Bus Depot', city: 'Homagama' },
    distanceKm: 24.5,
    approxDurationMins: 85,
    fareRange: { minLKR: 38, maxLKR: 145 },
    frequencyMins: 10,
    firstBusTime: '04:30 AM',
    lastBusTime: '11:45 PM',
    intermediateStops: [
      { stopName: 'Pettah' },
      { stopName: 'Maradana' },
      { stopName: 'Borella' },
      { stopName: 'Nugegoda' },
      { stopName: 'Maharagama' },
      { stopName: 'Kottawa' },
      { stopName: 'Homagama' }
    ]
  },
  {
    _id: 'route-100-02',
    routeNumber: '100',
    routeName: 'Colombo (Pettah) - Moratuwa / Panadura',
    category: 'Normal',
    operator: 'Joint Service',
    startLocation: { name: 'Pettah Bastian Mawatha', city: 'Colombo' },
    endLocation: { name: 'Panadura Bus Stand', city: 'Panadura' },
    distanceKm: 27.8,
    approxDurationMins: 90,
    fareRange: { minLKR: 38, maxLKR: 160 },
    frequencyMins: 8,
    firstBusTime: '04:45 AM',
    lastBusTime: '11:30 PM',
    intermediateStops: [
      { stopName: 'Pettah' },
      { stopName: 'Kollupitiya' },
      { stopName: 'Bambalapitiya' },
      { stopName: 'Dehiwala' },
      { stopName: 'Mount Lavinia' },
      { stopName: 'Moratuwa' },
      { stopName: 'Panadura' }
    ]
  },
  {
    _id: 'route-01-03',
    routeNumber: '1',
    routeName: 'Colombo (Pettah) - Kandy (Goods Shed)',
    category: 'Semi-Luxury',
    operator: 'SLTB',
    startLocation: { name: 'Colombo Central Bus Stand', city: 'Colombo' },
    endLocation: { name: 'Kandy Goods Shed', city: 'Kandy' },
    distanceKm: 115.0,
    approxDurationMins: 210,
    fareRange: { minLKR: 450, maxLKR: 780 },
    frequencyMins: 20,
    firstBusTime: '04:00 AM',
    lastBusTime: '10:00 PM',
    intermediateStops: [
      { stopName: 'Pettah' },
      { stopName: 'Peliyagoda' },
      { stopName: 'Kiribathgoda' },
      { stopName: 'Nittambuwa' },
      { stopName: 'Warakapola' },
      { stopName: 'Kegalle' },
      { stopName: 'Kadugannawa' },
      { stopName: 'Peradeniya' },
      { stopName: 'Kandy Central' }
    ]
  },
  {
    _id: 'route-ex001-04',
    routeNumber: 'EX-001',
    routeName: 'Makumbura (Kottawa) - Galle (Southern Expressway)',
    category: 'Highway Express',
    operator: 'SLTB',
    startLocation: { name: 'Makumbura Multimodal Hub', city: 'Kottawa' },
    endLocation: { name: 'Galle Central Bus Stand', city: 'Galle' },
    distanceKm: 104.0,
    approxDurationMins: 85,
    fareRange: { minLKR: 750, maxLKR: 950 },
    frequencyMins: 30,
    firstBusTime: '06:00 AM',
    lastBusTime: '09:00 PM',
    intermediateStops: [
      { stopName: 'Makumbura MTH' },
      { stopName: 'Dodangoda' },
      { stopName: 'Welipenna' },
      { stopName: 'Kurundugahahetekma' },
      { stopName: 'Pinnaduwa' },
      { stopName: 'Galle Central' }
    ]
  }
];

const JourneyPlanner = ({ t }) => {
  const navigate = useNavigate();
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [routeNumber, setRouteNumber] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [routes, setRoutes] = useState(sampleRoutesFallback);
  const [loading, setLoading] = useState(false);
  const [expandedRouteId, setExpandedRouteId] = useState(null);

  // Fetch routes from backend API
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/buses/routes');
        if (res.data && res.data.data && res.data.data.length > 0) {
          setRoutes(res.data.data);
        }
      } catch (err) {
        // Graceful fallback to rich sample dataset
        setRoutes(sampleRoutesFallback);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const handleSwap = () => {
    const temp = fromQuery;
    setFromQuery(toQuery);
    setToQuery(temp);
  };

  const filteredRoutes = routes.filter((route) => {
    const matchesCategory =
      selectedCategory === 'All' || route.category === selectedCategory;

    const matchesRouteNo =
      !routeNumber ||
      route.routeNumber.toLowerCase().includes(routeNumber.toLowerCase().trim());

    const matchesFrom =
      !fromQuery ||
      route.startLocation?.name?.toLowerCase().includes(fromQuery.toLowerCase().trim()) ||
      route.startLocation?.city?.toLowerCase().includes(fromQuery.toLowerCase().trim()) ||
      route.intermediateStops?.some((s) =>
        s.stopName.toLowerCase().includes(fromQuery.toLowerCase().trim())
      );

    const matchesTo =
      !toQuery ||
      route.endLocation?.name?.toLowerCase().includes(toQuery.toLowerCase().trim()) ||
      route.endLocation?.city?.toLowerCase().includes(toQuery.toLowerCase().trim()) ||
      route.intermediateStops?.some((s) =>
        s.stopName.toLowerCase().includes(toQuery.toLowerCase().trim())
      );

    return matchesCategory && matchesRouteNo && (matchesFrom || matchesTo || (!fromQuery && !toQuery));
  });

  const getBadgeColor = (category) => {
    switch (category) {
      case 'Highway Express':
        return 'bg-blue-600/20 text-blue-400 border-blue-500/40';
      case 'Semi-Luxury':
        return 'bg-amber-600/20 text-amber-300 border-amber-500/40';
      case 'Super Luxury AC':
        return 'bg-purple-600/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Planner Card */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>🧭</span> {t.findBuses}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Search by bus stand, intermediate stage, or route number
            </p>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-slate-500 self-center">Hot:</span>
            {['138', '100', '1', 'EX-001'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setRouteNumber(num)}
                className={`px-2.5 py-1 rounded-md font-mono font-bold transition-all ${
                  routeNumber === num
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                #{num}
              </button>
            ))}
            {routeNumber && (
              <button
                type="button"
                onClick={() => setRouteNumber('')}
                className="text-xs text-red-400 hover:text-red-300 underline self-center ml-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Search Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Origin */}
          <div className="md:col-span-4 relative">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              From (ආරම්භක ස්ථානය)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-slate-500">📍</span>
              <input
                type="text"
                value={fromQuery}
                onChange={(e) => setFromQuery(e.target.value)}
                placeholder={t.searchPlaceholderFrom}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm transition-all"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center pt-5">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2.5 rounded-full bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-300 border border-slate-700 transition-all shadow-md group"
              title="Swap Origin and Destination"
            >
              <svg className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>

          {/* Destination */}
          <div className="md:col-span-4 relative">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              To (ගමනාන්තය)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-slate-500">🏁</span>
              <input
                type="text"
                value={toQuery}
                onChange={(e) => setToQuery(e.target.value)}
                placeholder={t.searchPlaceholderTo}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm transition-all"
              />
            </div>
          </div>

          {/* Route Number Search */}
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Route No. (මාර්ග අංකය)
            </label>
            <input
              type="text"
              value={routeNumber}
              onChange={(e) => setRouteNumber(e.target.value)}
              placeholder="e.g. 138, 100"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm transition-all font-mono"
            />
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Category:</span>
          {['All', 'Normal', 'Semi-Luxury', 'Highway Express'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-slate-950 font-bold shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-8 space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-base font-bold text-slate-300">
            Available Timetables & Routes ({filteredRoutes.length})
          </h3>
          <span className="text-xs text-slate-500">
            Real-time GPS status enabled
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 animate-pulse">
            Loading Sri Lankan transit schedules...
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400">
            <p className="text-base font-semibold">No direct bus route matches your search.</p>
            <p className="text-xs text-slate-500 mt-1">Try searching for major hubs like 'Pettah', 'Kandy', or 'Maharagama'.</p>
          </div>
        ) : (
          filteredRoutes.map((route) => (
            <div
              key={route._id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Route Header */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3 py-1 bg-amber-400 text-slate-950 font-mono font-black text-sm rounded-lg shadow-sm">
                      Route {route.routeNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeColor(route.category)}`}>
                      {route.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      🏛️ {route.operator}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white tracking-wide">
                    {route.routeName}
                  </h4>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span>⏱️</span> Approx {route.approxDurationMins} mins
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span>📏</span> {route.distanceKm} km
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span>🔄</span> Every {route.frequencyMins} mins
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                      <span>💵</span> LKR {route.fareRange?.minLKR} - {route.fareRange?.maxLKR}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 sm:gap-3 self-start lg:self-center">
                  <button
                    onClick={() =>
                      setExpandedRouteId(
                        expandedRouteId === route._id ? null : route._id
                      )
                    }
                    className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
                  >
                    {expandedRouteId === route._id ? 'Hide Stops ▲' : 'View Stops ▼'}
                  </button>

                  <button
                    onClick={() => navigate(`/tracker?route=${route.routeNumber}`)}
                    className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  >
                    <span>🛰️</span> Track Live
                  </button>
                </div>
              </div>

              {/* Collapsible Intermediate Stops Timeline */}
              {expandedRouteId === route._id && route.intermediateStops && (
                <div className="mt-5 pt-4 border-t border-slate-800/80 animate-fadeIn">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Intermediate Stops & Timetable Sequence:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {route.intermediateStops.map((stop, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800"
                      >
                        <span className="text-amber-400 font-bold mr-1.5">{idx + 1}.</span>
                        <span className="text-slate-200">{stop.stopName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JourneyPlanner;
