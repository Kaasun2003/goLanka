import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SeatBookingHub from '../components/SeatBookingHub.jsx';

// Built-in Sri Lankan transit corridors for instant fast search
const popularRoutesData = [
  {
    routeNumber: '138',
    routeName: 'Colombo (Pettah) - Maharagama / Homagama',
    category: 'Normal / AC',
    origin: 'Pettah Central Bus Stand',
    destination: 'Homagama Bus Depot',
    stops: ['Pettah', 'Maradana', 'Borella', 'Nugegoda', 'Delkanda', 'Maharagama', 'Kottawa', 'Homagama'],
    duration: '85 mins',
    frequency: 'Every 8-10 mins',
    fareRange: 'LKR 38 - 145',
    firstBus: '04:30 AM',
    lastBus: '11:45 PM'
  },
  {
    routeNumber: '100',
    routeName: 'Colombo (Pettah) - Moratuwa / Panadura',
    category: 'Normal / Semi-Luxury',
    origin: 'Pettah Bastian Mawatha',
    destination: 'Panadura Bus Stand',
    stops: ['Pettah', 'Galle Face', 'Kollupitiya', 'Bambalapitiya', 'Dehiwala', 'Mount Lavinia', 'Moratuwa', 'Panadura'],
    duration: '90 mins',
    frequency: 'Every 8 mins',
    fareRange: 'LKR 38 - 160',
    firstBus: '04:45 AM',
    lastBus: '11:30 PM'
  },
  {
    routeNumber: '1',
    routeName: 'Colombo (Pettah) - Kandy (Goods Shed)',
    category: 'Semi-Luxury / AC',
    origin: 'Colombo Central Bus Stand (Pettah)',
    destination: 'Kandy Goods Shed Terminal',
    stops: ['Pettah', 'Peliyagoda', 'Kiribathgoda', 'Nittambuwa', 'Warakapola', 'Kegalle', 'Kadugannawa', 'Peradeniya', 'Kandy'],
    duration: '3 hrs 30 mins',
    frequency: 'Every 20 mins',
    fareRange: 'LKR 450 - 780',
    firstBus: '04:00 AM',
    lastBus: '10:00 PM'
  },
  {
    routeNumber: 'EX-001',
    routeName: 'Makumbura (Kottawa) - Galle Central (Expressway)',
    category: 'Highway Luxury Express',
    origin: 'Makumbura Multimodal Transport Hub',
    destination: 'Galle Central Bus Station',
    stops: ['Makumbura MTH', 'Dodangoda Interchange', 'Welipenna', 'Kurundugahahetekma', 'Pinnaduwa', 'Galle Central'],
    duration: '85 mins',
    frequency: 'Every 30 mins',
    fareRange: 'LKR 750 - 950',
    firstBus: '06:00 AM',
    lastBus: '09:00 PM'
  }
];

const popularStops = [
  { name: 'Pettah (පිටකොටුව)', value: 'Pettah' },
  { name: 'Kandy (මහනුවර)', value: 'Kandy' },
  { name: 'Galle (ගාල්ල)', value: 'Galle' },
  { name: 'Maharagama (මහරගම)', value: 'Maharagama' },
  { name: 'Panadura (පානදුර)', value: 'Panadura' },
  { name: 'Kottawa MTH (මාකුඹුර)', value: 'Makumbura' }
];

const Home = ({ t }) => {
  const navigate = useNavigate();
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [searchResults, setSearchResults] = useState(popularRoutesData);
  const [hasSearched, setHasSearched] = useState(false);

  // Swap From & To inputs easily in 1 click
  const handleSwap = () => {
    const temp = fromQuery;
    setFromQuery(toQuery);
    setToQuery(temp);
  };

  // Filter routes based on PickMe/Uber style search
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setHasSearched(true);

    const fromClean = fromQuery.toLowerCase().trim();
    const toClean = toQuery.toLowerCase().trim();

    const matches = popularRoutesData.filter((route) => {
      const matchFrom =
        !fromClean ||
        route.origin.toLowerCase().includes(fromClean) ||
        route.stops.some((s) => s.toLowerCase().includes(fromClean)) ||
        route.routeName.toLowerCase().includes(fromClean);

      const matchTo =
        !toClean ||
        route.destination.toLowerCase().includes(toClean) ||
        route.stops.some((s) => s.toLowerCase().includes(toClean)) ||
        route.routeName.toLowerCase().includes(toClean);

      return matchFrom && matchTo;
    });

    setSearchResults(matches);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION & SMART SEARCH BAR */}
      <section className="relative pt-10 sm:pt-16 pb-8 px-4 overflow-hidden">
        {/* Subtle background ambient lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-emerald-600/15 via-blue-600/15 to-emerald-500/10 blur-3xl pointer-events-none rounded-full"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          
          {/* Active Network Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs sm:text-sm font-bold text-slate-200 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-400 font-extrabold">1,850+ Active Buses Today</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-300 hidden sm:inline">Island-wide Real-Time GPS</span>
          </div>

          {/* Catchy & Friendly Bilingual Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              ශ්‍රී ලංකාවේ ඕනෑම බස් රථයක් <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                පහසුවෙන්ම සොයාගන්න
              </span>
            </h1>
            <p className="text-base sm:text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
              Find schedules, track real-time bus locations with live GPS, and manage digital season passes effortlessly.
            </p>
          </div>

          {/* UBER / PICKME STYLE SMART BUS SEARCH BAR */}
          <div className="pt-4 text-left">
            <div className="bg-slate-900/95 backdrop-blur-2xl border-2 border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-slate-950/80 relative">
              
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
                  
                  {/* Origin Input (From) */}
                  <div className="lg:col-span-5 relative">
                    <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center gap-1.5">
                      <span>🟢</span> කොහෙන්ද? (From / Starting Stop)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-xl select-none">📍</span>
                      <input
                        type="text"
                        value={fromQuery}
                        onChange={(e) => setFromQuery(e.target.value)}
                        placeholder="පිටත්වන තැන (e.g. Pettah, Maharagama, Kandy)"
                        className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-700 hover:border-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 rounded-2xl text-white text-base font-medium placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Swap Button (1-Click Reverse) */}
                  <div className="lg:col-span-1 flex justify-center pt-2 lg:pt-6">
                    <button
                      type="button"
                      onClick={handleSwap}
                      className="p-3.5 rounded-2xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 border border-slate-700 transition-all shadow-lg group focus:outline-none"
                      title="Swap Origin and Destination (මාරු කරන්න)"
                      aria-label="Swap locations"
                    >
                      <svg className="w-5 h-5 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </button>
                  </div>

                  {/* Destination Input (To) */}
                  <div className="lg:col-span-6 relative">
                    <label className="block text-xs font-bold uppercase tracking-wider text-blue-400 mb-1.5 flex items-center gap-1.5">
                      <span>🔴</span> කොහෙටද? (To / Destination)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-xl select-none">🏁</span>
                      <input
                        type="text"
                        value={toQuery}
                        onChange={(e) => setToQuery(e.target.value)}
                        placeholder="ගමනාන්තය (e.g. Galle, Panadura, Kandy)"
                        className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-700 hover:border-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-2xl text-white text-base font-medium placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* Big Clear Search Button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  
                  {/* Preset Quick Chips */}
                  <div className="flex flex-wrap items-center gap-2 text-xs w-full sm:w-auto">
                    <span className="text-slate-400 font-semibold">නිතර යන තැන්:</span>
                    {popularStops.map((stop) => (
                      <button
                        key={stop.value}
                        type="button"
                        onClick={() => {
                          if (!fromQuery) setFromQuery(stop.value);
                          else setToQuery(stop.value);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 font-medium transition-all"
                      >
                        {stop.name}
                      </button>
                    ))}
                  </div>

                  {/* Search Action CTA */}
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-slate-950 font-black text-base tracking-wide shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2.5 active:scale-95"
                  >
                    <span>🔍</span>
                    <span>බස් සොයන්න / Search Buses</span>
                  </button>
                </div>
              </form>

              {/* SEARCH RESULTS PREVIEW */}
              {searchResults.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span className="font-bold text-slate-300">
                      හමු වූ බස් මාර්ග ({searchResults.length})
                    </span>
                    <span>SLTB & Private Schedules</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResults.map((route) => (
                      <div
                        key={route.routeNumber}
                        className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="px-3 py-1 bg-emerald-500 text-slate-950 font-mono font-black text-sm rounded-lg">
                              Route {route.routeNumber}
                            </span>
                            <span className="text-[11px] font-bold text-blue-300 bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
                              {route.category}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white line-clamp-1">{route.routeName}</h4>
                          <p className="text-xs text-slate-400 mt-1">
                            ⏱️ {route.duration} • 🔄 {route.frequency} • 💵 {route.fareRange}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                          <span className="text-[11px] text-slate-500">
                            {route.firstBus} - {route.lastBus}
                          </span>
                          <button
                            type="button"
                            onClick={() => navigate(`/tracker?route=${route.routeNumber}`)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                          >
                            <span>🛰️</span> සජීවීව බලන්න
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {hasSearched && searchResults.length === 0 && (
                <div className="mt-6 pt-6 border-t border-slate-800 text-center py-6 text-slate-400">
                  <p className="font-semibold text-white">ඔබ සෙවූ ස්ථාන සඳහා ඍජු බස් මාර්ගයක් හමු නොවීය.</p>
                  <p className="text-xs text-slate-500 mt-1">කරුණාකර ප්‍රධාන බස් නැවතුම්පොළක් (උදා: පිටකොටුව, මහරගම, නුවර) යොදා බලන්න.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE LARGE INTERACTIVE ACTION CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
            ප්‍රධාන සේවාවන් / Core Services
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            ඔබට අවශ්‍ය සේවාව තෝරන්න
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Designed for all age groups (15 to 50+) with large, readable buttons and fast direct access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: Live Bus Tracker */}
          <div
            onClick={() => navigate('/tracker')}
            className="group relative bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-800 hover:border-emerald-500/80 rounded-3xl p-7 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>

            <div className="space-y-4 relative">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                🛰️
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  GPS සජීවී සිතියම
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
                  Live Bus Tracker
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  බස් එක කොහේද තියෙන්නේ, ලඟාවන වේලාව (ETA) සහ වේගය සජීවී Leaflet GPS සිතියමෙන් ක්ෂණිකව බලාගන්න.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[11px] font-semibold bg-slate-950 text-slate-300 px-3 py-1 rounded-xl border border-slate-800">
                  📍 Live GPS Coordinates
                </span>
                <span className="text-[11px] font-semibold bg-slate-950 text-slate-300 px-3 py-1 rounded-xl border border-slate-800">
                  ⏱️ Real ETA
                </span>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-800/80">
              <button
                type="button"
                className="w-full py-3.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-emerald-500/20"
              >
                <span>සජීවී සිතියම බලන්න</span>
                <span>➔</span>
              </button>
            </div>
          </div>

          {/* Card 2: Seat Booking Hub */}
          <div
            onClick={() => {
              const el = document.getElementById('booking');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-800 hover:border-blue-500/80 rounded-3xl p-7 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>

            <div className="space-y-4 relative">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                💺
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                  අන්තර්නගර ආසන වෙන්කිරීම
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-blue-400 transition-colors">
                  Seat Booking Hub
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  අධිවේගී හා දුරගමන් සුඛෝපභෝගී බස් රථවල ආසන නිවසේ සිටම පහසුවෙන් වෙන්කරවා ගන්න.
                </p>
              </div>

              {/* Partner Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[11px] font-bold bg-red-950/40 text-red-300 border border-red-800/60 px-2.5 py-1 rounded-xl">
                  SLTB e-Sheet
                </span>
                <span className="text-[11px] font-bold bg-amber-950/40 text-amber-300 border border-amber-800/60 px-2.5 py-1 rounded-xl">
                  NCG Express
                </span>
                <span className="text-[11px] font-bold bg-blue-950/40 text-blue-300 border border-blue-800/60 px-2.5 py-1 rounded-xl">
                  Magiya (මගියා)
                </span>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-800/80">
              <button
                type="button"
                className="w-full py-3.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-blue-500/20"
              >
                <span>ආසන වෙන්කිරීම් වෙත</span>
                <span>➔</span>
              </button>
            </div>
          </div>

          {/* Card 3: Online Season Pass */}
          <div
            onClick={() => navigate('/season')}
            className="group relative bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-800 hover:border-amber-400/80 rounded-3xl p-7 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-400/10 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all"></div>

            <div className="space-y-4 relative">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                🎫
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  ඩිජිටල් වාර ප්‍රවේශපත්‍ර
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                  Online Season Pass
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  ඩිපෝවල පෝලිමේ නොසිට පාසල්, සරසවි සිසුන්ට සහ රාජ්‍ය සේවකයින්ට QR කේතය සහිත සීසන් පාස් එක ගන්න.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[11px] font-semibold bg-slate-950 text-amber-300 px-3 py-1 rounded-xl border border-amber-500/30 font-bold">
                  🎓 75% Student Subsidy
                </span>
                <span className="text-[11px] font-semibold bg-slate-950 text-slate-300 px-3 py-1 rounded-xl border border-slate-800">
                  📱 Phone QR Pass
                </span>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-800/80">
              <button
                type="button"
                className="w-full py-3.5 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-amber-400/20"
              >
                <span>සීසන් පාස් අයදුම් කරන්න</span>
                <span>➔</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. THREE-STEP SIMPLE TRANSIT GUIDE FOR COMMUTERS & ELDERS */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              සරල පියවර 3යි / How It Works
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-white">
              ඕනෑම කෙනෙකුට පහසුවෙන් භාවිතා කළ හැක
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center mx-auto sm:mx-0">
                1
              </span>
              <h4 className="text-base font-bold text-white">මාර්ගය සොයන්න</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                පිටත්වන තැන සහ යන තැන ඇතුළත් කර බස් අංකය සහ වේලාවන් ලබාගන්න.
              </p>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
              <span className="w-8 h-8 rounded-full bg-blue-500 text-white font-black text-sm flex items-center justify-center mx-auto sm:mx-0">
                2
              </span>
              <h4 className="text-base font-bold text-white">සජීවීව බලන්න</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                බස් රථය දැන් ඇති ස්ථානය GPS සිතියමෙන් පරීක්ෂා කර පාරට බහින්න.
              </p>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
              <span className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center mx-auto sm:mx-0">
                3
              </span>
              <h4 className="text-base font-bold text-white">සුවපහසුව ගමන් යන්න</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                ආසන කලින් වෙන්කරවා ගෙන හෝ ඩිජිටල් QR සීසන් පාස් එක පෙන්වා ගමන් යන්න.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTEGRATED SEAT BOOKING HUB */}
      <section className="px-4">
        <SeatBookingHub t={t} />
      </section>

    </div>
  );
};

export default Home;
