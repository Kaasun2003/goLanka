import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ currentLang = 'si', setLanguage, t }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('golanka_theme') === 'light';
  });

  const location = useLocation();
  const notificationRef = useRef(null);

  // Sync theme with document element
  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('golanka_theme', 'light');
    } else {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('golanka_theme', 'dark');
    }
  }, [isLightMode]);

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
  };

  // Trilingual Labels for Navigation Tabs
  const getSeatBookingLabel = () => {
    if (currentLang === 'en') return 'Seat Booking';
    if (currentLang === 'ta') return 'இருக்கை முன்பதிவு';
    return 'ආසන වෙන්කිරීම';
  };

  const getQrPassLabel = () => {
    if (currentLang === 'en') return 'My QR Pass';
    if (currentLang === 'ta') return 'QR பாஸ்';
    return 'QR පාස්';
  };

  const navLinks = [
    { to: '/', label: t.home || 'Home', icon: '🏠', localHint: 'මුල් පිටුව' },
    { to: '/tracker', label: t.liveTracker || 'Live Bus Tracker', icon: '🛰️', localHint: 'සජීවී සිතියම', isLive: true },
    { to: '/season', label: t.seasonPass || 'Digital Season Pass', icon: '🎫', localHint: 'සීසන් පාස්' },
    { to: '/booking', label: getSeatBookingLabel(), icon: '💺', localHint: 'ආසන වෙන්කිරීම', isNew: true }
  ];

  const languages = [
    { code: 'si', label: 'සිංහල' },
    { code: 'en', label: 'ENG' },
    { code: 'ta', label: 'தமிழ்' }
  ];

  const transitAlerts = [
    {
      id: 1,
      tag: 'Expressway',
      tagColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      title: 'දක්ෂිණ අධිවේගී මාර්ගය (EX-001)',
      desc: 'මාකුඹුර සිට ගාල්ල දක්වා ගමනාගමනය සාමාන්‍ය පරිදි සිදුවේ.',
      time: 'මීට මිනිත්තු 5 කට පෙර'
    },
    {
      id: 2,
      tag: 'High Density',
      tagColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      title: 'මාර්ග අංක 138 (පිටකොටුව - හෝමාගම)',
      desc: 'පැය 1ක කාලය තුළ බස් රථ 14ක් ධාවනය වේ. සාමාන්‍ය පොරොත්තු කාලය විනාඩි 4යි.',
      time: 'මීට මිනිත්තු 12 කට පෙර'
    },
    {
      id: 3,
      tag: 'Route 1',
      tagColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      title: 'කොළඹ - මහනුවර (කඩුගන්නාව)',
      desc: 'කඳුකර මාර්ගයේ කාලගුණය යහපත්ය. නායයෑම් හෝ බාධා වාර්තා වී නොමැත.',
      time: 'මීට මිනිත්තු 25 කට පෙර'
    }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/95 border-b border-slate-800/90 shadow-2xl transition-all">
        {/* Expanded wide container for spacious breathing room */}
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-24">
            
            {/* 1. LEFT ZONE: Brand Logo & Title */}
            <Link to="/" className="flex items-center gap-4 group flex-shrink-0">
              <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden shadow-xl border-2 border-emerald-500/40 group-hover:border-emerald-400 transition-all bg-slate-900 flex items-center justify-center p-0.5">
                <img
                  src="/logo.jpg"
                  alt="goLanka Logo"
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<span class="text-2xl font-black text-emerald-400">gL</span>`;
                  }}
                />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                    go<span className="text-emerald-400">Lanka</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    🇱🇰 Transit
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium tracking-wide">
                  ශ්‍රී ලංකා ඩිජිටල් බස් ප්‍රවාහන ජාලය
                </p>
              </div>
            </Link>

            {/* 2. CENTER ZONE: Spacious Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`group relative px-4 xl:px-5 py-3 rounded-2xl text-[15px] xl:text-base font-bold transition-all duration-200 flex items-center gap-2.5 ${
                      active
                        ? 'text-emerald-300 bg-slate-900/95 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/15'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border-2 border-transparent'
                    }`}
                  >
                    <span className="text-lg transition-transform group-hover:scale-110">
                      {link.icon}
                    </span>
                    <span className="tracking-wide">{link.label}</span>
                    
                    {link.isLive && (
                      <span className="flex h-2.5 w-2.5 relative ml-0.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                    )}

                    {link.isNew && (
                      <span className="text-[10px] uppercase font-black bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}

                    {active && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-400 rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* 3. RIGHT ZONE: QR Pass, Theme Toggle, Notifications, Languages & Hotline */}
            <div className="hidden md:flex items-center gap-4 xl:gap-6 flex-shrink-0">
              
              {/* Quick Access "📱 QR පාස්" Button with subtle glow */}
              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/25 border border-emerald-300/40 flex items-center gap-2 active:scale-95 transition-all"
                title="Open My Digital QR Pass (මගේ QR පාස් එක)"
              >
                <span className="text-base">📱</span>
                <span>{getQrPassLabel()}</span>
              </button>

              {/* Notification Bell Icon with Active Badge Dot */}
              <div className="relative" ref={notificationRef}>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white transition-all relative focus:outline-none shadow-inner"
                  title="Live Transit Alerts (සජීවී නිවේදන)"
                  aria-label="View Transit Notifications"
                >
                  <span className="text-xl">🔔</span>
                  {/* Active pulsing badge dot */}
                  <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </span>
                </button>

                {/* Live Transit Alerts Dropdown Popup */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-5 shadow-2xl z-50 animate-fadeIn space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📢</span>
                        <h4 className="text-sm font-bold text-white">සජීවී මාර්ග නිවේදන (Transit Alerts)</h4>
                      </div>
                      <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full">
                        3 New
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-72 overflow-y-auto">
                      {transitAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${alert.tagColor}`}>
                              {alert.tag}
                            </span>
                            <span className="text-[10px] text-slate-500">{alert.time}</span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-200">{alert.title}</h5>
                          <p className="text-[11px] text-slate-400 leading-snug">{alert.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-center">
                      <span className="text-[11px] text-slate-400">
                        National Transport Commission • Verified Status
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Dark / Light Mode Theme Toggle Button with Smooth Rotation Animation */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-3 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white transition-all shadow-inner focus:outline-none group"
                title={isLightMode ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
                aria-label="Toggle theme mode"
              >
                <div className="transform transition-transform duration-500 ease-in-out group-hover:rotate-180">
                  {isLightMode ? (
                    <span className="text-xl">🌙</span>
                  ) : (
                    <span className="text-xl text-amber-300">☀️</span>
                  )}
                </div>
              </button>

              {/* Trilingual Language Switcher Toggle */}
              <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1.5 shadow-inner">
                {languages.map((lang) => {
                  const isSelected = currentLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage(lang.code)}
                      className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-black'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      aria-label={`Switch language to ${lang.label}`}
                    >
                      {lang.label}
                    </button>
                  );
                })}
              </div>

              {/* 24/7 SLTB Hotline Box */}
              <div className="pl-4 border-l border-slate-800 text-right">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  24/7 SLTB Line
                </span>
                <a
                  href="tel:1955"
                  className="text-base font-mono font-black text-amber-400 hover:text-amber-300 flex items-center gap-1 justify-end transition-colors"
                  title="Call SLTB Passenger Helpline"
                >
                  <span>📞</span>
                  <span>1955</span>
                </a>
              </div>
            </div>

            {/* Mobile Controls (Right side of mobile bar) */}
            <div className="flex lg:hidden items-center gap-2">
              
              {/* Quick QR button on mobile */}
              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow-md"
              >
                📱 QR
              </button>

              {/* Theme toggle on mobile */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-slate-900 text-slate-300 border border-slate-800 text-sm"
              >
                {isLightMode ? '🌙' : '☀️'}
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-2xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 focus:outline-none shadow-md"
                aria-label="Toggle navigation menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* 4. MOBILE HAMBURGER MENU DRAWER */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-5 border-t border-slate-800/90 space-y-4 animate-fadeIn">
              
              {/* Navigation links in drawer */}
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-5 py-3.5 rounded-2xl text-base font-bold transition-all ${
                      isActive(link.to)
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-sm'
                        : 'text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-2xl">{link.icon}</span>
                      <div>
                        <span className="block text-base">{link.label}</span>
                        <span className="text-xs text-slate-400 font-normal">{link.localHint}</span>
                      </div>
                    </div>
                    {link.isLive && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full font-bold">
                        LIVE RADAR
                      </span>
                    )}
                    {link.isNew && (
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full font-bold">
                        NEW
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Language switcher pills in mobile drawer */}
              <div className="pt-2 px-2 flex items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400">භාෂාව / Language:</span>
                <div className="flex gap-1.5">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage(lang.code)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                        currentLang === lang.code
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'text-slate-400'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hotline in mobile drawer */}
              <div className="pt-2 px-2 flex justify-between items-center text-sm text-slate-300">
                <span>National Helpline:</span>
                <a href="tel:1955" className="text-amber-400 font-mono font-bold text-base flex items-center gap-1.5">
                  <span>📞</span> 1955 (SLTB) / 1958
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 5. QUICK MY QR PASS POPUP MODAL */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5 text-center">
            
            {/* Close button */}
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl p-1 rounded-lg"
              aria-label="Close Modal"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="inline-block text-4xl mb-1">📱</span>
              <h3 className="text-xl font-black text-white">මගේ ඩිජිටල් QR පාස් එක</h3>
              <p className="text-xs text-slate-400">Official Sri Lankan Digital Bus Transit Pass</p>
            </div>

            {/* High-contrast QR display */}
            <div className="p-4 bg-white rounded-2xl shadow-xl mx-auto w-52 h-52 flex flex-col items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-950">
                <rect x="5" y="5" width="25" height="25" />
                <rect x="9" y="9" width="17" height="17" fill="white" />
                <rect x="13" y="13" width="9" height="9" />

                <rect x="70" y="5" width="25" height="25" />
                <rect x="74" y="9" width="17" height="17" fill="white" />
                <rect x="78" y="13" width="9" height="9" />

                <rect x="5" y="70" width="25" height="25" />
                <rect x="9" y="74" width="17" height="17" fill="white" />
                <rect x="13" y="78" width="9" height="9" />

                <rect x="35" y="10" width="5" height="5" />
                <rect x="45" y="15" width="5" height="10" />
                <rect x="55" y="5" width="5" height="5" />
                <rect x="35" y="35" width="30" height="30" fill="#10b981" />
                <rect x="42" y="42" width="16" height="16" fill="white" />
                <rect x="15" y="40" width="10" height="5" />
                <rect x="75" y="45" width="15" height="5" />
                <rect x="40" y="75" width="10" height="15" />
                <rect x="60" y="70" width="15" height="8" />
              </svg>
              <span className="text-[10px] font-mono font-bold text-slate-900 mt-1 block">
                GL-PASS-OFFICIAL-2026
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-400">● Active Transit Pass</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Coverage:</span>
                <span className="text-white">SLTB & Private Joint Routes</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to="/season"
                onClick={() => setQrModalOpen(false)}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-colors"
              >
                සම්පූර්ණ විස්තර බලන්න ➔
              </Link>
              <button
                onClick={() => setQrModalOpen(false)}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors"
              >
                වසන්න (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
