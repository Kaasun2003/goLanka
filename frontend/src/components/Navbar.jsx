import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = ({ currentLang = 'si', setLanguage, t }) => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('golanka_theme') === 'light';
  });

  const location = useLocation();
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const toggleTheme = (e) => {
    const nextMode = !isLightMode;

    // 1. Calculate button origin coordinates for radial expansion
    const rect = e?.currentTarget?.getBoundingClientRect?.();
    const x = e?.clientX ?? (rect ? rect.left + rect.width / 2 : window.innerWidth / 2);
    const y = e?.clientY ?? (rect ? rect.top + rect.height / 2 : 40);

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // 2. Physical Glowing Radial Ripple expanding outward across the entire screen
    try {
      const ripple = document.createElement('div');
      ripple.className = 'theme-radial-ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.setProperty('--ripple-radius', `${endRadius * 2.2}px`);
      ripple.style.background = nextMode
        ? 'radial-gradient(circle, rgba(248, 250, 252, 0.98) 0%, rgba(241, 245, 249, 0.92) 50%, rgba(226, 232, 240, 0.7) 100%)'
        : 'radial-gradient(circle, rgba(2, 6, 23, 0.98) 0%, rgba(15, 23, 42, 0.92) 50%, rgba(15, 23, 42, 0.7) 100%)';
      document.body.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 700);
    } catch {
      // Fallback if DOM manipulation fails
    }

    // 3. View Transitions API with circular clip-path reveal
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const transition = document.startViewTransition(() => {
        setIsLightMode(nextMode);
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`
            ]
          },
          {
            duration: 650,
            easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );
      });
    } else {
      setIsLightMode(nextMode);
    }
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

  const getLoginButtonLabel = () => {
    if (currentLang === 'en') return 'Login';
    if (currentLang === 'ta') return 'உள்நுழைக';
    return 'ගිණුම / Login';
  };

  const navLinks = [
    { to: '/', label: t.home || 'Home', icon: '🏠', localHint: 'මුල් පිටුව' },
    { to: '/tracker', label: t.liveTracker || 'Live Radar', icon: '🛰️', localHint: 'සජීවී සිතියම', isLive: true },
    { to: '/season', label: t.seasonPass || 'Season Pass', icon: '🎫', localHint: 'සීසන් පාස්' },
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
      {/* Clean Full-Width Sticky Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-slate-950/95 border-b border-slate-800/90 shadow-2xl transition-all">
        {/* Full-Width Symmetrical Navigation Bar with edge-to-edge balance */}
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="relative flex items-center justify-between h-20 gap-2 sm:gap-4">
            
            {/* 1. LEFT ZONE: Brand Logo & Title */}
            <div className="flex items-center gap-3 z-10 flex-shrink-0">
              <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-xl border-2 border-emerald-500/40 group-hover:border-emerald-400 transition-all bg-slate-900 flex items-center justify-center p-0.5 flex-shrink-0">
                  <img
                    src="/logo.jpg"
                    alt="goLanka Logo"
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<span class="text-xl font-black text-emerald-400">gL</span>`;
                    }}
                  />
                </div>

                <div className="space-y-0.5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                      go<span className="text-emerald-400">Lanka</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      🇱🇰 Transit
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium tracking-wide hidden 2xl:block">
                    ශ්‍රී ලංකා ඩිජිටල් බස් ප්‍රවාහන ජාලය
                  </p>
                </div>
              </Link>
            </div>

            {/* 2. CENTER ZONE: Single-Line Navigation Tabs (xl:flex = 1280px+) - Exactly Centered */}
            <nav className="absolute left-1/2 -translate-x-1/2 z-10 hidden xl:flex items-center gap-1.5 2xl:gap-3 flex-shrink-0">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`group relative px-3 2xl:px-4 py-2 2xl:py-2.5 rounded-2xl text-xs 2xl:text-sm font-bold transition-all duration-200 flex items-center gap-2 whitespace-nowrap flex-shrink-0 active:scale-95 ${
                      active
                        ? 'text-emerald-300 bg-slate-900 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/15'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border-2 border-transparent'
                    }`}
                  >
                    <span className="text-base 2xl:text-lg transition-transform group-hover:scale-110 flex-shrink-0">
                      {link.icon}
                    </span>
                    <span className="tracking-wide whitespace-nowrap leading-none select-none">
                      {link.label}
                    </span>
                    
                    {link.isLive && (
                      <span className="flex h-2 w-2 relative ml-0.5 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-sm"></span>
                      </span>
                    )}

                    {link.isNew && (
                      <span className="text-[9px] uppercase font-black bg-blue-500/20 text-blue-300 border border-blue-500/40 px-1.5 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap shadow-sm">
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

            {/* 3. RIGHT ZONE: Language, Theme (Image 2 style), Bell, QR Pass & User Profile (Far Right) */}
            <div className="hidden xl:flex items-center gap-2 2xl:gap-3 flex-shrink-0 z-10">
              
              {/* 1. Trilingual Language Switcher Toggle */}
              <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1 shadow-inner flex-shrink-0 whitespace-nowrap">
                {languages.map((lang) => {
                  const isSelected = currentLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage(lang.code)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
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

              {/* 2. Theme Toggle Button (Image 2 VisionOS Liquid Glass Capsule Switch) */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`relative flex items-center h-10 px-1 rounded-full transition-all duration-300 cursor-pointer shadow-inner active:scale-95 flex-shrink-0 group ${
                  isLightMode
                    ? 'bg-slate-200 border border-slate-300/80 w-[96px] justify-end'
                    : 'bg-[#0e131d] border border-slate-700/90 w-[96px] justify-start shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]'
                }`}
                title={isLightMode ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
                aria-label="Toggle theme mode"
              >
                {/* Text Label */}
                <span
                  className={`text-[11px] font-bold tracking-wide transition-colors duration-300 select-none ${
                    isLightMode
                      ? 'order-1 pl-2.5 text-slate-700'
                      : 'order-2 pr-2.5 ml-auto text-slate-200'
                  }`}
                >
                  {isLightMode ? 'Dark' : 'Light'}
                </span>

                {/* 3D Liquid Glass Orb with glowing Moon/Sun icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    isLightMode
                      ? 'order-2 bg-gradient-to-br from-amber-200 to-amber-400 shadow-[0_2px_12px_rgba(251,191,36,0.6)] border border-amber-300 text-amber-950'
                      : 'order-1 bg-white/10 backdrop-blur-xl shadow-[0_4px_16px_rgba(255,255,255,0.2),inset_0_1px_2px_rgba(255,255,255,0.6)] border border-white/30 text-white'
                  }`}
                >
                  {isLightMode ? (
                    /* Glowing Sun SVG */
                    <svg className="w-4 h-4 text-amber-600 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zm12.75 0a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM12 18.75a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM4.5 12a.75.75 0 01-.75.75H1.5a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM17.657 6.343a.75.75 0 011.06 0l1.592 1.591a.75.75 0 11-1.06 1.06l-1.592-1.59a.75.75 0 010-1.061zm-11.314 11.314a.75.75 0 011.06 0l1.592 1.591a.75.75 0 11-1.06 1.06l-1.592-1.59a.75.75 0 010-1.061zm12.374 1.591a.75.75 0 010 1.06l-1.592 1.592a.75.75 0 01-1.06-1.06l1.591-1.592a.75.75 0 011.061 0zm-11.314-11.314a.75.75 0 010 1.06L5.81 9.274a.75.75 0 11-1.06-1.06l1.591-1.592a.75.75 0 011.061 0z" />
                    </svg>
                  ) : (
                    /* Glowing Crisp Crescent Moon SVG */
                    <svg className="w-4 h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.95)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                  )}
                </div>
              </button>

              {/* 3. Notification Bell Icon */}
              <div className="relative flex-shrink-0" ref={notificationRef}>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2.5 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white transition-all relative focus:outline-none shadow-inner flex-shrink-0 cursor-pointer active:scale-90"
                  title="Live Transit Alerts"
                  aria-label="View Transit Notifications"
                >
                  <span className="text-lg">🔔</span>
                  <span className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                </button>

                {/* Live Transit Alerts Dropdown Popup */}
                {notificationsOpen && (
                  <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-5 shadow-2xl z-50 animate-scale-in space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📢</span>
                        <h4 className="text-sm font-bold text-white">සජීවී මාර්ග නිවේදන (Transit Alerts)</h4>
                      </div>
                      <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-0.5 rounded-full">
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

              {/* 4. Quick Access "📱 QR පාස්" Button */}
              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="px-3 py-2.5 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-300 font-bold text-xs 2xl:text-sm tracking-wide shadow-sm flex items-center gap-1.5 active:scale-95 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer"
                title="Open My Digital QR Pass"
              >
                <span className="text-base flex-shrink-0">📱</span>
                <span className="whitespace-nowrap font-bold hidden 2xl:inline">{getQrPassLabel()}</span>
                <span className="whitespace-nowrap font-bold 2xl:hidden">QR</span>
              </button>

              {/* 5. USER PROFILE / LOGIN BUTTON (AT THE VERY FAR RIGHT EDGE) */}
              {isAuthenticated && user ? (
                <div className="relative flex-shrink-0" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900 border-2 border-emerald-500/50 hover:border-emerald-400 text-white shadow-lg shadow-emerald-500/10 transition-all cursor-pointer active:scale-95"
                    title="User Profile & Account Options"
                  >
                    <span className="w-7 h-7 rounded-xl bg-slate-950 border border-emerald-400/50 flex items-center justify-center text-base flex-shrink-0">
                      {user.avatar || '👤'}
                    </span>
                    <div className="text-left hidden 2xl:block max-w-[110px]">
                      <p className="text-xs font-black text-white truncate leading-tight">
                        {user.fullName?.split(' ')[0] || 'Commuter'}
                      </p>
                      <span className="text-[10px] text-emerald-400 font-bold block truncate leading-tight">
                        {user.userType === 'Student' ? '🎓 Student' : user.userType === 'Office Commuter' ? '💼 Office' : '👤 Commuter'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">▾</span>
                  </button>

                  {/* Profile Dropdown Popup */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-3 w-72 bg-slate-900 border-2 border-slate-700/90 rounded-3xl p-4 shadow-2xl z-50 animate-scale-in space-y-3">
                      {/* Header Summary */}
                      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-emerald-500/40 flex items-center justify-center text-2xl flex-shrink-0">
                          {user.avatar || '👤'}
                        </div>
                        <div className="truncate text-left">
                          <h4 className="text-sm font-black text-white truncate">{user.fullName}</h4>
                          <p className="text-xs text-slate-400 font-mono truncate">{user.phoneNumber}</p>
                          <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                            {user.userType || 'General Commuter'}
                          </span>
                        </div>
                      </div>

                      {/* Dropdown Navigation Actions */}
                      <div className="space-y-1 text-left">
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-xs font-bold text-slate-200 hover:text-white transition-colors"
                        >
                          <span className="text-base">👤</span>
                          <span>{t.myProfile || 'My Profile & Dashboard'}</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setQrModalOpen(true);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-xs font-bold text-slate-200 hover:text-white transition-colors cursor-pointer text-left"
                        >
                          <span className="text-base">📱</span>
                          <span>{t.myQrPass || 'My Digital QR Pass'}</span>
                        </button>

                        <Link
                          to="/booking"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-xs font-bold text-slate-200 hover:text-white transition-colors"
                        >
                          <span className="text-base">💺</span>
                          <span>{t.seatBooking || 'Seat Bookings'}</span>
                        </Link>
                      </div>

                      {/* Logout Button */}
                      <div className="pt-2 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                            navigate('/');
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <span>🚪</span>
                          <span>{t.logout || 'Logout (ඉවත් වන්න)'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Sleek Login / Sign Up Button */
                <button
                  type="button"
                  onClick={() => openAuthModal('phone')}
                  className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs 2xl:text-sm tracking-wide shadow-lg shadow-emerald-500/25 border border-emerald-300/40 flex items-center gap-1.5 active:scale-95 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer"
                  title="Login or Create Account"
                >
                  <span className="text-base flex-shrink-0">👤</span>
                  <span className="whitespace-nowrap font-black">{getLoginButtonLabel()}</span>
                </button>
              )}

            </div>

            {/* 4. MOBILE & TABLET CONTROLS (< 1280px / xl:hidden) */}
            <div className="flex xl:hidden items-center gap-2">
              
              {/* Account / Login button on mobile */}
              {isAuthenticated && user ? (
                <Link
                  to="/profile"
                  className="w-9 h-9 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-sm shadow-sm"
                  title="My Profile"
                >
                  {user.avatar || '👤'}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('phone')}
                  className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs"
                >
                  👤 Login
                </button>
              )}

              {/* Quick QR button on mobile */}
              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="liquid-glass-qr-btn px-2.5 py-1.5 text-slate-950 font-black text-xs"
              >
                📱 QR
              </button>

              {/* Theme toggle on mobile */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`!w-9 !h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-90 ${
                  isLightMode
                    ? 'bg-amber-100 border border-amber-300 text-amber-600 shadow-amber-200/50'
                    : 'bg-slate-900 border border-slate-700/80 text-white'
                }`}
                title={isLightMode ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
              >
                {isLightMode ? (
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zm12.75 0a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM12 18.75a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM4.5 12a.75.75 0 01-.75.75H1.5a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM17.657 6.343a.75.75 0 011.06 0l1.592 1.591a.75.75 0 11-1.06 1.06l-1.592-1.59a.75.75 0 010-1.061zm-11.314 11.314a.75.75 0 011.06 0l1.592 1.591a.75.75 0 11-1.06 1.06l-1.592-1.59a.75.75 0 010-1.061zm12.374 1.591a.75.75 0 010 1.06l-1.592 1.592a.75.75 0 01-1.06-1.06l1.591-1.592a.75.75 0 011.061 0zm-11.314-11.314a.75.75 0 010 1.06L5.81 9.274a.75.75 0 11-1.06-1.06l1.591-1.592a.75.75 0 011.061 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                )}
              </button>

              {/* Mobile Menu Toggle Button */}
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

          {/* 5. MOBILE & TABLET HAMBURGER MENU DRAWER */}
          {mobileMenuOpen && (
            <div className="xl:hidden mt-3 pt-4 border-t border-white/10 space-y-3 animate-fadeIn pb-3">
              
              {/* User Account Tile in Mobile Drawer */}
              {isAuthenticated && user ? (
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{user.avatar || '👤'}</span>
                    <div className="text-left">
                      <p className="text-xs font-black text-white">{user.fullName}</p>
                      <p className="text-[10px] text-emerald-400 font-mono">{user.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30"
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="px-2 py-1 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-bold"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('phone');
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>👤</span>
                  <span>{getLoginButtonLabel()}</span>
                </button>
              )}

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

      {/* 6. QUICK MY QR PASS POPUP MODAL */}
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
              <h3 className="text-xl font-black text-white">
                {currentLang === 'si' ? 'මගේ ඩිජිටල් QR පාස් එක' : currentLang === 'ta' ? 'எனது QR பாஸ்' : 'My Digital QR Pass'}
              </h3>
              <p className="text-xs text-slate-300/80">
                {user?.activeSeasonPass?.passType || 'Official Sri Lankan Digital Bus Transit Pass'}
              </p>
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
                {user?.activeSeasonPass?.qrCodeToken || 'GL-PASS-OFFICIAL-2026'}
              </span>
            </div>

            <div className="liquid-glass-pill p-3.5 text-xs text-slate-200 space-y-1.5 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Pass Holder:</span>
                <span className="font-bold text-white">{user?.fullName || 'Kasun Malinda Bandara'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-emerald-400">● {user?.activeSeasonPass?.approvalStatus || 'Active Transit Pass'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Designated Route:</span>
                <span className="text-white font-mono">Route {user?.activeSeasonPass?.routeNumber || '138'}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to="/profile"
                onClick={() => setQrModalOpen(false)}
                className="flex-1 py-3 liquid-glass-qr-btn text-slate-950 font-black text-xs text-center"
              >
                සම්පූර්ණ Dashboard එක බලන්න ➔
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
