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
      {/* Floating Sticky Liquid Glass Navigation Bar */}
      <header className="sticky top-2 sm:top-3.5 z-50 w-full px-2.5 sm:px-4 md:px-6 xl:px-8 py-1 transition-all">
        {/* Liquid Glass Capsule Bar */}
        <div className="w-full liquid-glass-container px-3.5 sm:px-5 xl:px-7 py-2.5 sm:py-3 shadow-2xl">
          <div className="flex items-center justify-between gap-3 xl:gap-5">
            
            {/* 1. LEFT ZONE: 3D Liquid Glass Orb Logo & Brand */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              {/* 3D Liquid Glass Orb - Spherical lens styling from user reference */}
              <div className="w-12 h-12 sm:w-13 sm:h-13 liquid-glass-orb p-1 flex-shrink-0 cursor-pointer">
                <img
                  src="/logo.jpg"
                  alt="goLanka Logo"
                  className="w-full h-full object-cover rounded-full shadow-inner"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<span class="text-xl font-black text-emerald-400">gL</span>`;
                  }}
                />
              </div>

              <div className="space-y-0.5 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors drop-shadow-sm">
                    go<span className="text-emerald-400">Lanka</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider liquid-glass-pill px-2.5 py-0.5 text-emerald-300 border-emerald-500/30 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    🇱🇰 Transit
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300/80 font-medium tracking-wide">
                  ශ්‍රී ලංකා ඩිජිටල් බස් ප්‍රවාහන ජාලය
                </p>
              </div>
            </Link>

            {/* 2. CENTER ZONE: Liquid Glass Navigation Tab Pills */}
            <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 2xl:gap-3 flex-shrink-0 flex-nowrap">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`group relative px-3.5 xl:px-4 2xl:px-5 py-2 xl:py-2.5 text-sm xl:text-[15px] font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap flex-shrink-0 flex-nowrap ${
                      active
                        ? 'liquid-glass-pill-active text-emerald-300 font-extrabold'
                        : 'liquid-glass-pill text-slate-200 hover:text-white'
                    }`}
                  >
                    <span className="text-base xl:text-lg transition-transform group-hover:scale-110 flex-shrink-0 drop-shadow-sm">
                      {link.icon}
                    </span>
                    <span className="tracking-wide whitespace-nowrap leading-none select-none drop-shadow-sm">
                      {link.label}
                    </span>
                    
                    {link.isLive && (
                      <span className="flex h-2.5 w-2.5 relative ml-0.5 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-sm"></span>
                      </span>
                    )}

                    {link.isNew && (
                      <span className="text-[10px] uppercase font-black bg-blue-500/25 text-blue-200 border border-blue-400/40 px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap shadow-sm">
                        NEW
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* 3. RIGHT ZONE: Liquid Glass Interactive Controls */}
            <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 2xl:gap-4 flex-shrink-0 flex-nowrap">
              
              {/* Quick Access "📱 QR පාස්" Liquid Glass Button */}
              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="liquid-glass-qr-btn px-3.5 xl:px-4 py-2 xl:py-2.5 text-slate-950 font-black text-xs sm:text-sm tracking-wide flex items-center gap-2 active:scale-95 whitespace-nowrap flex-shrink-0 cursor-pointer"
                title="Open My Digital QR Pass (මගේ QR පාස් එක)"
              >
                <span className="text-sm xl:text-base flex-shrink-0">📱</span>
                <span className="whitespace-nowrap font-black">{getQrPassLabel()}</span>
              </button>

              {/* Liquid Glass Circular Notification Bell Button */}
              <div className="relative flex-shrink-0" ref={notificationRef}>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="liquid-glass-icon-btn text-slate-200 hover:text-white relative focus:outline-none flex-shrink-0 cursor-pointer"
                  title="Live Transit Alerts (සජීවී නිවේදන)"
                  aria-label="View Transit Notifications"
                >
                  <span className="text-base xl:text-lg">🔔</span>
                  {/* Active pulsing badge dot */}
                  <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  </span>
                </button>

                {/* Live Transit Alerts Liquid Glass Dropdown Popup */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 liquid-glass-container rounded-3xl p-5 shadow-2xl z-50 animate-fadeIn space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📢</span>
                        <h4 className="text-sm font-bold text-white">සජීවී මාර්ග නිවේදන (Transit Alerts)</h4>
                      </div>
                      <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-0.5 rounded-full">
                        3 New
                      </span>
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {transitAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="p-3 liquid-glass-pill rounded-2xl space-y-1 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${alert.tagColor}`}>
                              {alert.tag}
                            </span>
                            <span className="text-[10px] text-slate-400">{alert.time}</span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-100">{alert.title}</h5>
                          <p className="text-[11px] text-slate-300/80 leading-snug">{alert.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-white/10 text-center">
                      <span className="text-[11px] text-slate-400">
                        National Transport Commission • Verified Status
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Circular Liquid Glass Dark / Light Mode Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="liquid-glass-icon-btn text-slate-200 hover:text-white group flex-shrink-0 cursor-pointer"
                title={isLightMode ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
                aria-label="Toggle theme mode"
              >
                <div className="transform transition-transform duration-500 ease-in-out group-hover:rotate-180">
                  {isLightMode ? (
                    <span className="text-base xl:text-lg">🌙</span>
                  ) : (
                    <span className="text-base xl:text-lg text-amber-300">☀️</span>
                  )}
                </div>
              </button>

              {/* Segmented Liquid Glass Trilingual Language Switcher */}
              <div className="liquid-glass-segmented flex-shrink-0 whitespace-nowrap">
                {languages.map((lang) => {
                  const isSelected = currentLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage(lang.code)}
                      className={`px-3 py-1.5 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'liquid-glass-seg-active font-black'
                          : 'text-slate-300 hover:text-white'
                      }`}
                      aria-label={`Switch language to ${lang.label}`}
                    >
                      {lang.label}
                    </button>
                  );
                })}
              </div>

              {/* Liquid Glass 24/7 SLTB Line Badge */}
              <div className="liquid-glass-pill px-3.5 py-1.5 flex items-center gap-2 flex-shrink-0 whitespace-nowrap hidden xl:flex">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider whitespace-nowrap">
                  24/7 LINE
                </span>
                <a
                  href="tel:1955"
                  className="text-sm font-mono font-black text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors whitespace-nowrap"
                  title="Call SLTB Passenger Helpline"
                >
                  <span>📞</span>
                  <span>1955</span>
                </a>
              </div>
            </div>

            {/* Mobile Controls (Liquid Glass Buttons for mobile) */}
            <div className="flex lg:hidden items-center gap-2">
              
              {/* Quick QR button on mobile */}
              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="liquid-glass-qr-btn px-3 py-1.5 text-slate-950 font-black text-xs"
              >
                📱 QR
              </button>

              {/* Theme toggle on mobile */}
              <button
                type="button"
                onClick={toggleTheme}
                className="liquid-glass-icon-btn !w-9 !h-9 text-xs"
              >
                {isLightMode ? '🌙' : '☀️'}
              </button>

              {/* Mobile Menu Toggle Button (styled with 3 liquid glass bars matching reference) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="liquid-glass-icon-btn !w-10 !h-10 text-slate-200 hover:text-white"
                aria-label="Toggle navigation menu"
              >
                <div className="flex flex-col gap-1 items-center justify-center w-5">
                  <span className={`block h-0.5 w-5 bg-slate-200 rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`block h-0.5 w-5 bg-slate-200 rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block h-0.5 w-5 bg-slate-200 rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>

          {/* 4. MOBILE HAMBURGER MENU LIQUID GLASS DRAWER */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pt-4 border-t border-white/10 space-y-3 animate-fadeIn">
              
              {/* Navigation links in drawer */}
              <div className="space-y-1.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-base font-bold transition-all ${
                      isActive(link.to)
                        ? 'liquid-glass-pill-active text-emerald-300'
                        : 'liquid-glass-pill text-slate-200 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{link.icon}</span>
                      <div>
                        <span className="block text-sm sm:text-base">{link.label}</span>
                        <span className="text-[11px] text-slate-400 font-normal">{link.localHint}</span>
                      </div>
                    </div>
                    {link.isLive && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
                        LIVE
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
              <div className="liquid-glass-pill p-3 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">භාෂාව / Language:</span>
                <div className="liquid-glass-segmented">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage(lang.code)}
                      className={`px-3 py-1 text-xs font-bold transition-all ${
                        currentLang === lang.code
                          ? 'liquid-glass-seg-active font-black'
                          : 'text-slate-300'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hotline in mobile drawer */}
              <div className="liquid-glass-pill p-3 flex justify-between items-center text-sm text-slate-300">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xl animate-fadeIn">
          <div className="liquid-glass-container rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5 text-center border-white/20">
            
            {/* Close button */}
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 liquid-glass-icon-btn !w-8 !h-8 text-slate-300 hover:text-white text-base"
              aria-label="Close Modal"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="inline-block text-4xl mb-1 drop-shadow-md">📱</span>
              <h3 className="text-xl font-black text-white">මගේ ඩිජිටල් QR පාස් එක</h3>
              <p className="text-xs text-slate-300/80">Official Sri Lankan Digital Bus Transit Pass</p>
            </div>

            {/* High-contrast QR display */}
            <div className="p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl mx-auto w-52 h-52 flex flex-col items-center justify-center border border-white">
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

            <div className="liquid-glass-pill p-3.5 text-xs text-slate-200 space-y-1.5 text-left">
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
                className="flex-1 py-3 liquid-glass-qr-btn text-slate-950 font-black text-xs text-center"
              >
                සම්පූර්ණ විස්තර බලන්න ➔
              </Link>
              <button
                onClick={() => setQrModalOpen(false)}
                className="px-4 py-3 liquid-glass-pill text-slate-200 hover:text-white font-bold text-xs"
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
