import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SeatBookingHub from '../components/SeatBookingHub.jsx';

// Built-in Sri Lankan transit corridors with multi-language support
const popularRoutesData = [
  {
    routeNumber: '138',
    routeName: 'Colombo (Pettah) - Maharagama / Homagama',
    routeNameSi: 'කොළඹ (පිටකොටුව) - මහරගම / හෝමාගම',
    routeNameTa: 'கொழும்பு (புறக்கோட்டை) - மகரகம / ஹோமாகம',
    category: 'Normal / AC',
    origin: 'Pettah Central Bus Stand',
    destination: 'Homagama Bus Depot',
    stops: ['Pettah', 'Maradana', 'Borella', 'Nugegoda', 'Delkanda', 'Maharagama', 'Kottawa', 'Homagama', 'පිටකොටුව', 'මහරගම', 'හෝමාගම'],
    duration: '85 mins',
    frequency: 'Every 8-10 mins',
    fareRange: 'LKR 38 - 145',
    firstBus: '04:30 AM',
    lastBus: '11:45 PM'
  },
  {
    routeNumber: '100',
    routeName: 'Colombo (Pettah) - Moratuwa / Panadura',
    routeNameSi: 'කොළඹ (පිටකොටුව) - මොරටුව / පානදුර',
    routeNameTa: 'கொழும்பு (புறக்கோட்டை) - மொரட்டுவ / பாணந்துறை',
    category: 'Normal / Semi-Luxury',
    origin: 'Pettah Bastian Mawatha',
    destination: 'Panadura Bus Stand',
    stops: ['Pettah', 'Galle Face', 'Kollupitiya', 'Bambalapitiya', 'Dehiwala', 'Mount Lavinia', 'Moratuwa', 'Panadura', 'පානදුර', 'මොරටුව'],
    duration: '90 mins',
    frequency: 'Every 8 mins',
    fareRange: 'LKR 38 - 160',
    firstBus: '04:45 AM',
    lastBus: '11:30 PM'
  },
  {
    routeNumber: '1',
    routeName: 'Colombo (Pettah) - Kandy (Goods Shed)',
    routeNameSi: 'කොළඹ (පිටකොටුව) - මහනුවර (ගුඩ්ෂෙඩ්)',
    routeNameTa: 'கொழும்பு (புறக்கோட்டை) - கண்டி (குட்ஸ் ஷெட்)',
    category: 'Semi-Luxury / AC',
    origin: 'Colombo Central Bus Stand (Pettah)',
    destination: 'Kandy Goods Shed Terminal',
    stops: ['Pettah', 'Peliyagoda', 'Kiribathgoda', 'Nittambuwa', 'Warakapola', 'Kegalle', 'Kadugannawa', 'Peradeniya', 'Kandy', 'මහනුවර', 'කෑගල්ල'],
    duration: '3 hrs 30 mins',
    frequency: 'Every 20 mins',
    fareRange: 'LKR 450 - 780',
    firstBus: '04:00 AM',
    lastBus: '10:00 PM'
  },
  {
    routeNumber: 'EX-001',
    routeName: 'Makumbura (Kottawa) - Galle Central (Expressway)',
    routeNameSi: 'මාකුඹුර (කොට්ටාව) - ගාල්ල මධ්‍යම (අධිවේගී)',
    routeNameTa: 'மாக்கும்புர (கொட்டாவ) - காலி மத்திய (அதிவேக நெடுஞ்சாலை)',
    category: 'Highway Luxury Express',
    origin: 'Makumbura Multimodal Transport Hub',
    destination: 'Galle Central Bus Station',
    stops: ['Makumbura MTH', 'Dodangoda Interchange', 'Welipenna', 'Kurundugahahetekma', 'Pinnaduwa', 'Galle Central', 'මාකුඹුර', 'ගාල්ල'],
    duration: '85 mins',
    frequency: 'Every 30 mins',
    fareRange: 'LKR 750 - 950',
    firstBus: '06:00 AM',
    lastBus: '09:00 PM'
  }
];

const getPopularStops = (lang) => {
  if (lang === 'en') {
    return [
      { name: 'Pettah', value: 'Pettah' },
      { name: 'Kandy', value: 'Kandy' },
      { name: 'Galle', value: 'Galle' },
      { name: 'Maharagama', value: 'Maharagama' },
      { name: 'Panadura', value: 'Panadura' },
      { name: 'Makumbura MTH', value: 'Makumbura' }
    ];
  }
  if (lang === 'ta') {
    return [
      { name: 'புறக்கோட்டை (Pettah)', value: 'Pettah' },
      { name: 'கண்டி (Kandy)', value: 'Kandy' },
      { name: 'காலி (Galle)', value: 'Galle' },
      { name: 'மகரகம (Maharagama)', value: 'Maharagama' },
      { name: 'பாணந்துறை (Panadura)', value: 'Panadura' },
      { name: 'மாக்கும்புர (Makumbura)', value: 'Makumbura' }
    ];
  }
  return [
    { name: 'Pettah (පිටකොටුව)', value: 'Pettah' },
    { name: 'Kandy (මහනුවර)', value: 'Kandy' },
    { name: 'Galle (ගාල්ල)', value: 'Galle' },
    { name: 'Maharagama (මහරගම)', value: 'Maharagama' },
    { name: 'Panadura (පානදුර)', value: 'Panadura' },
    { name: 'Kottawa MTH (මාකුඹුර)', value: 'Makumbura' }
  ];
};

const Home = ({ t = {}, currentLang = 'si' }) => {
  const navigate = useNavigate();
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [searchResults, setSearchResults] = useState(popularRoutesData);
  const [hasSearched, setHasSearched] = useState(false);

  const stopsList = getPopularStops(currentLang);

  const getRouteName = (route) => {
    if (currentLang === 'si' && route.routeNameSi) return route.routeNameSi;
    if (currentLang === 'ta' && route.routeNameTa) return route.routeNameTa;
    return route.routeName;
  };

  // Swap From & To inputs easily in 1 click
  const handleSwap = () => {
    const temp = fromQuery;
    setFromQuery(toQuery);
    setToQuery(temp);
  };

  // Smooth scroll to an in-page section and trigger highlight animation
  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.remove('section-highlight-active');
      void el.offsetWidth; // trigger reflow
      el.classList.add('section-highlight-active');
      setTimeout(() => {
        el.classList.remove('section-highlight-active');
      }, 2200);
    }
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
        (route.stops && route.stops.some((s) => s.toLowerCase().includes(fromClean))) ||
        route.routeName.toLowerCase().includes(fromClean) ||
        (route.routeNameSi && route.routeNameSi.toLowerCase().includes(fromClean));

      const matchTo =
        !toClean ||
        route.destination.toLowerCase().includes(toClean) ||
        (route.stops && route.stops.some((s) => s.toLowerCase().includes(toClean))) ||
        route.routeName.toLowerCase().includes(toClean) ||
        (route.routeNameSi && route.routeNameSi.toLowerCase().includes(toClean));

      return matchFrom && matchTo;
    });

    setSearchResults(matches);
  };

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* 1. SPLIT HERO SECTION: Left (Search Box) & Right (Hero text) with Scenic Bus Background */}
      <section className="relative pt-6 sm:pt-10 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden animate-fade-in-up">
        {/* Scenic Sri Lankan Bus Transit Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <img
            src="/hero-bus-scenic.jpg"
            alt="Scenic Sri Lanka Luxury Bus travel through mist-covered tea estate mountains"
            className="hero-scenic-img w-full h-full object-cover object-[center_35%] filter brightness-[0.46] contrast-[1.12] saturate-[1.2] transform scale-[1.02] transition-all duration-500"
          />
          {/* Dark Mode cinematic gradients for contrast & depth */}
          <div className="hero-scenic-overlay-dark absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/92 pointer-events-none"></div>
          <div className="hero-scenic-overlay-dark absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80 pointer-events-none"></div>
          <div className="hero-scenic-overlay-dark absolute inset-0 bg-slate-950/25 backdrop-blur-[1px] pointer-events-none"></div>

          {/* Light Mode clean frosted gradients for contrast & depth */}
          <div className="hero-scenic-overlay-light absolute inset-0 bg-gradient-to-r from-slate-50/95 via-slate-50/80 to-slate-50/92 pointer-events-none"></div>
          <div className="hero-scenic-overlay-light absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-slate-50/80 pointer-events-none"></div>
          <div className="hero-scenic-overlay-light absolute inset-0 bg-white/30 backdrop-blur-[1px] pointer-events-none"></div>
        </div>

        {/* Subtle background ambient lights */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full z-0"></div>
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[350px] bg-blue-500/10 blur-[130px] pointer-events-none rounded-full z-0"></div>

        <div className="w-full max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 items-start lg:items-center">
            
            {/* 1. LEFT COLUMN (2nd Image Content): PickMe/Uber Style Smart Search Card & Popular Routes */}
            <div className="lg:col-span-7 min-w-0 w-full">
              <div className="bg-slate-900/95 backdrop-blur-2xl border-2 border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl relative text-left animate-scale-in delay-150 min-w-0">
                
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    
                    {/* Origin Input (From) */}
                    <div className="sm:col-span-5 relative min-w-0">
                      <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center gap-1.5">
                        <span>🟢</span> {t.searchFromLabel || 'කොහෙන්ද? (From / Starting Stop)'}
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-xl select-none">📍</span>
                        <input
                          type="text"
                          value={fromQuery}
                          onChange={(e) => setFromQuery(e.target.value)}
                          placeholder={t.searchPlaceholderFrom || 'පිටත්වන තැන (e.g. Pettah, Maharagama, Kandy)'}
                          className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-950/80 border border-slate-700/80 hover:border-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 rounded-2xl text-white text-sm sm:text-base font-medium placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                        />
                      </div>
                    </div>

                    {/* Swap Button (1-Click Reverse) */}
                    <div className="sm:col-span-2 flex justify-center pt-1 sm:pt-6">
                      <button
                        type="button"
                        onClick={handleSwap}
                        className="p-3.5 rounded-2xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 border border-slate-700/80 transition-all shadow-md group focus:outline-none cursor-pointer flex items-center justify-center active:scale-90"
                        title={currentLang === 'en' ? 'Swap Origin and Destination' : currentLang === 'ta' ? 'மாற்றுக' : 'මාරු කරන්න'}
                        aria-label="Swap locations"
                      >
                        <svg className="w-5 h-5 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </button>
                    </div>

                    {/* Destination Input (To) */}
                    <div className="sm:col-span-5 relative min-w-0">
                      <label className="block text-xs font-bold uppercase tracking-wider text-blue-400 mb-1.5 flex items-center gap-1.5">
                        <span>🔴</span> {t.searchToLabel || 'කොහෙටද? (To / Destination)'}
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-xl select-none">🏁</span>
                        <input
                          type="text"
                          value={toQuery}
                          onChange={(e) => setToQuery(e.target.value)}
                          placeholder={t.searchPlaceholderTo || 'ගමනාන්තය (e.g. Galle, Panadura, Kandy)'}
                          className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-950/80 border border-slate-700/80 hover:border-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-2xl text-white text-sm sm:text-base font-medium placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preset Quick Chips & Search Button */}
                  <div className="pt-2 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
                    
                    {/* Preset Quick Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs w-full">
                      <span className="text-slate-400 font-semibold mr-1">
                        {t.frequentStops || 'නිතර යන තැන්:'}
                      </span>
                      {stopsList.map((stop) => (
                        <button
                          key={stop.value}
                          type="button"
                          onClick={() => {
                            if (!fromQuery) setFromQuery(stop.value);
                            else setToQuery(stop.value);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 font-medium transition-all cursor-pointer text-xs shadow-sm active:scale-95"
                        >
                          {stop.name}
                        </button>
                      ))}
                    </div>

                    {/* Search Action CTA Button */}
                    <button
                      type="submit"
                      className="w-full xl:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-slate-950 font-black text-sm sm:text-base tracking-wide shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer whitespace-nowrap flex-shrink-0"
                    >
                      <span>🔍</span>
                      <span>{t.searchBtn || 'බස් සොයන්න'}</span>
                    </button>
                  </div>
                </form>

                {/* SEARCH RESULTS / POPULAR BUS CORRIDORS (Smooth animated list) */}
                {searchResults.length > 0 && (
                  <div key={hasSearched ? `${fromQuery}-${toQuery}` : 'popular-routes'} className="mt-6 pt-5 border-t border-white/10 space-y-3 animate-fade-in-up">
                    <div className="flex justify-between items-center text-xs text-slate-400">
                      <span className="font-bold text-slate-200">
                        {t.routesFound || 'හමු වූ බස් මාර්ග'} ({searchResults.length})
                      </span>
                      <span className="text-slate-400 font-medium">
                        {t.sltbPrivateSchedules || 'SLTB & Private Schedules'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
                      {searchResults.map((route, idx) => (
                        <div
                          key={route.routeNumber}
                          style={{ animationDelay: `${idx * 70}ms` }}
                          className="animate-fade-in-up bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 shadow-md hover:-translate-y-1 duration-200"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-mono font-black text-xs sm:text-sm rounded-lg shadow-sm">
                                Route {route.routeNumber}
                              </span>
                              <span className="text-[10px] font-bold text-blue-300 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded-full">
                                {route.category}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white line-clamp-1">
                              {getRouteName(route)}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1">
                              ⏱️ {route.duration} • 🔄 {route.frequency} • 💵 {route.fareRange}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                            <span className="text-[11px] text-slate-500 font-mono">
                              {route.firstBus} - {route.lastBus}
                            </span>
                            <button
                              type="button"
                              onClick={() => navigate(`/tracker?route=${route.routeNumber}`)}
                              className="px-3.5 py-1.5 bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/40 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                            >
                              <span>🛰️</span> {t.viewLive || 'සජීවීව බලන්න'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {hasSearched && searchResults.length === 0 && (
                  <div className="mt-6 pt-6 border-t border-white/10 text-center py-6 text-slate-400 space-y-1">
                    <p className="font-semibold text-white">
                      {t.noRoutesFound || 'ඔබ සෙවූ ස්ථාන සඳහා ඍජු බස් මාර්ගයක් හමු නොවීය.'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {t.noRoutesHelp || 'කරුණාකර ප්‍රධාන බස් නැවතුම්පොළක් (උදා: පිටකොටුව, මහරගම, නුවර) යොදා බලන්න.'}
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* 2. RIGHT COLUMN (1st Image Content): Hero Badge, Large Title, Subtitle & Key Badges */}
            <div className="lg:col-span-5 space-y-6 text-left animate-fade-in-up delay-100 min-w-0 w-full">
              
              {/* Active Network Pill Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs sm:text-sm font-bold text-slate-200 shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0"></span>
                <span className="text-emerald-400 font-extrabold whitespace-nowrap">
                  {t.heroBadge || '1,850+ Active Buses Today • Island-wide Real-Time GPS'}
                </span>
              </div>

              {/* Large Catchy Heading */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black text-white tracking-tight leading-[1.15]">
                  {t.heroTitlePart1 || 'ශ්‍රී ලංකාවේ ඕනෑම බස් රථයක්'} <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                    {t.heroTitlePart2 || 'පහසුවෙන්ම සොයාගන්න'}
                  </span>
                </h1>
                
                {/* Multilingual Subtitle */}
                <p className="text-sm sm:text-base xl:text-lg text-slate-300 font-medium leading-relaxed">
                  {t.heroSubtitle || 'Find schedules, track real-time bus locations with live GPS, and manage digital season passes effortlessly.'}
                </p>
              </div>

              {/* 4 Feature Badges (Island-wide, Real-Time GPS, Fleets, Digital QR) */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 shadow-md hover:border-slate-700 transition-colors min-w-0">
                  <span className="text-2xl flex-shrink-0">🗺️</span>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                      {currentLang === 'en' ? 'Island-wide' : currentLang === 'ta' ? 'நாடு தழுவிய' : 'දිවයින පුරා'}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-white truncate block">
                      {currentLang === 'en' ? 'All 9 Provinces' : currentLang === 'ta' ? '9 மாகாணங்கள்' : 'පළාත් 9ම'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 shadow-md hover:border-slate-700 transition-colors min-w-0">
                  <span className="text-2xl flex-shrink-0">⚡</span>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                      {currentLang === 'en' ? 'Telemetry' : currentLang === 'ta' ? 'நேரலை ஜிபிஎஸ்' : 'සජීවී දත්ත'}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-emerald-400 truncate block">
                      Real-Time GPS
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 shadow-md hover:border-slate-700 transition-colors min-w-0">
                  <span className="text-2xl flex-shrink-0">🚌</span>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                      {currentLang === 'en' ? 'Bus Network' : currentLang === 'ta' ? 'பேருந்து நெட்வொர்க்' : 'බස් ජාලය'}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-white truncate block">
                      SLTB & Private
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 shadow-md hover:border-slate-700 transition-colors min-w-0">
                  <span className="text-2xl flex-shrink-0">📱</span>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                      {currentLang === 'en' ? 'Digital Pass' : currentLang === 'ta' ? 'டிஜிட்டல் பாஸ்' : 'ඩිජිටල් පාස්'}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-amber-300 truncate block">
                      100% Phone QR
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. THREE LARGE INTERACTIVE ACTION CARDS (Multilingual Dynamic) */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2 scroll-reveal">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
            {t.coreServicesTag || 'ප්‍රධාන සේවාවන් / Core Services'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {t.coreServicesTitle || 'ඔබට අවශ්‍ය සේවාව තෝරන්න'}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {t.coreServicesSubtitle || 'Designed for all age groups (15 to 50+) with large, readable buttons and fast direct access.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-left">
          
          {/* Card 1: Live Bus Tracker */}
          <div
            onClick={() => navigate('/tracker')}
            className="scroll-reveal-scale delay-100 group relative bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-800 hover:border-emerald-500/80 rounded-3xl p-7 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 active:scale-98"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>

            <div className="space-y-4 relative">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                🛰️
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  {t.cardTrackerTag || 'GPS සජීවී සිතියම'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
                  {t.cardTrackerTitle || 'Live Bus Tracker'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  {t.cardTrackerDesc || 'බස් එක කොහේද තියෙන්නේ, ලඟාවන වේලාව (ETA) සහ වේගය සජීවී Leaflet GPS සිතියමෙන් ක්ෂණිකව බලාගන්න.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[11px] font-semibold bg-slate-950 text-slate-300 px-3 py-1 rounded-xl border border-slate-800">
                  📍 Real-Time GPS
                </span>
                <span className="text-[11px] font-semibold bg-slate-950 text-slate-300 px-3 py-1 rounded-xl border border-slate-800">
                  ⏱️ Live ETA
                </span>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-800/80">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/tracker');
                }}
                className="w-full py-3.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-emerald-500/20 active:scale-95"
              >
                <span>{t.cardTrackerBtn || 'සජීවී සිතියම බලන්න'}</span>
                <span>➔</span>
              </button>
            </div>
          </div>

          {/* Card 2: Seat Booking Hub */}
          <div
            onClick={() => scrollToSection('booking')}
            className="scroll-reveal-scale delay-200 group relative bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-800 hover:border-blue-500/80 rounded-3xl p-7 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 active:scale-98"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>

            <div className="space-y-4 relative">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                💺
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                  {t.cardBookingTag || 'අන්තර්නගර ආසන වෙන්කිරීම'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-blue-400 transition-colors">
                  {t.cardBookingTitle || 'Seat Booking Hub'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  {t.cardBookingDesc || 'අධිවේගී හා දුරගමන් සුඛෝපභෝගී බස් රථවල ආසන නිවසේ සිටම පහසුවෙන් වෙන්කරවා ගන්න.'}
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
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToSection('booking');
                }}
                className="w-full py-3.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-blue-500/20 active:scale-95"
              >
                <span>{t.cardBookingBtn || 'ආසන වෙන්කිරීම් වෙත'}</span>
                <span>➔</span>
              </button>
            </div>
          </div>

          {/* Card 3: Online Season Pass */}
          <div
            onClick={() => navigate('/season')}
            className="scroll-reveal-scale delay-300 group relative bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-800 hover:border-amber-400/80 rounded-3xl p-7 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-400/10 cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 active:scale-98"
          >
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all"></div>

            <div className="space-y-4 relative">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                🎫
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  {t.cardSeasonTag || 'ඩිජිටල් වාර ප්‍රවේශපත්‍ර'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
                  {t.cardSeasonTitle || 'Online Season Pass'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  {t.cardSeasonDesc || 'ඩිපෝවල පෝලිමේ නොසිට පාසල්, සරසවි සිසුන්ට සහ රාජ්‍ය සේවකයින්ට QR කේතය සහිත සීසන් පාස් එක ගන්න.'}
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
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/season');
                }}
                className="w-full py-3.5 px-5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-amber-400/20 active:scale-95"
              >
                <span>{t.cardSeasonBtn || 'සීසන් පාස් අයදුම් කරන්න'}</span>
                <span>➔</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. THREE-STEP SIMPLE TRANSIT GUIDE (Multilingual Dynamic) */}
      <section id="guide" className="max-w-5xl mx-auto px-4 scroll-reveal">
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1 scroll-reveal">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              {t.howItWorksTag || 'සරල පියවර 3යි / How It Works'}
            </span>
            <h3 className="text-xl sm:text-3xl font-black text-white">
              {t.howItWorksTitle || 'ඕනෑම කෙනෙකුට පහසුවෙන් භාවිතා කළ හැක'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2 scroll-reveal delay-100">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center mx-auto sm:mx-0">
                1
              </span>
              <h4 className="text-base font-bold text-white">{t.step1Title || 'මාර්ගය සොයන්න'}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.step1Desc || 'පිටත්වන තැන සහ යන තැන ඇතුළත් කර බස් අංකය සහ වේලාවන් ලබාගන්න.'}
              </p>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2 scroll-reveal delay-200">
              <span className="w-8 h-8 rounded-full bg-blue-500 text-white font-black text-sm flex items-center justify-center mx-auto sm:mx-0">
                2
              </span>
              <h4 className="text-base font-bold text-white">{t.step2Title || 'සජීවීව බලන්න'}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.step2Desc || 'බස් රථය දැන් ඇති ස්ථානය GPS සිතියමෙන් පරීක්ෂා කර පාරට බහින්න.'}
              </p>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2 scroll-reveal delay-300">
              <span className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center mx-auto sm:mx-0">
                3
              </span>
              <h4 className="text-base font-bold text-white">{t.step3Title || 'සුවපහසුව ගමන් යන්න'}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.step3Desc || 'ආසන කලින් වෙන්කරවා ගෙන හෝ ඩිජිටල් QR සීසන් පාස් එක පෙන්වා ගමන් යන්න.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTEGRATED SEAT BOOKING HUB */}
      <section id="booking-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-reveal">
        <SeatBookingHub t={t} currentLang={currentLang} />
      </section>

    </div>
  );
};

export default Home;
