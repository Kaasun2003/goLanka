import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const Navbar = ({ currentLang = 'si', setLanguage, t, onOpenQr }) => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { isLightMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const location = useLocation();
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Trilingual Labels for Navigation Tabs
  const getSeatBookingLabel = () => {
    if (currentLang === 'en') return 'Seat Booking';
    if (currentLang === 'ta') return 'இருக்கை பதிவு';
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
      {/* VisionOS Floating Liquid Glass Navigation Bar (Fixed over page background) */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full px-2 sm:px-3 md:px-4 lg:px-5 pt-1.5 sm:pt-2 pb-1 bg-transparent pointer-events-none transition-all duration-300">
        {/* Floating Liquid Glass Dock with Refraction, Specular Rim & Edge Glow */}
        <div className="liquid-glass-nav-bar w-full max-w-[1860px] mx-auto rounded-2xl sm:rounded-3xl px-2.5 sm:px-3 md:px-4 lg:px-5 xl:px-6 pointer-events-auto transition-all duration-300">
          <div className="relative flex items-center justify-between h-18 sm:h-20 gap-2 lg:gap-3 xl:gap-4 w-full">
            
            {/* 1. LEFT ZONE: Brand Logo & Title */}
            <div className="flex items-center gap-2.5 sm:gap-3 z-10 flex-shrink-0">
              <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-2xl overflow-hidden shadow-xl border-2 border-emerald-500/40 group-hover:border-emerald-400 transition-all bg-white/10 backdrop-blur-xl flex items-center justify-center p-0.5 flex-shrink-0">
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
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-xl sm:text-2xl 2xl:text-3xl font-black tracking-tight text-slate-950 group-hover:text-emerald-700 transition-colors drop-shadow-sm">
                      go<span className="text-emerald-700">Lanka</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-black tracking-wider bg-emerald-500/25 text-slate-950 border border-emerald-600/40 px-2 sm:px-2.5 py-0.5 rounded-full shadow-sm backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      🇱🇰 Transit
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-950 font-bold tracking-wide hidden 2xl:block drop-shadow-sm">
                    ශ්‍රී ලංකා ඩිජිටල් බස් ප්‍රවාහන ජාලය
                  </p>
                </div>
              </Link>
            </div>

            {/* 2. CENTER ZONE: Single-Line Navigation Tabs (lg:flex = 1024px+) - Balanced & Responsive */}
            <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 2xl:gap-3 flex-1 min-w-0 mx-1 xl:mx-2 2xl:mx-3 z-10">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`group relative px-2 lg:px-2.5 xl:px-3.5 2xl:px-4 py-1.5 xl:py-2 rounded-xl xl:rounded-2xl text-xs 2xl:text-sm font-black transition-all duration-200 flex items-center gap-1 xl:gap-1.5 2xl:gap-2 whitespace-nowrap flex-shrink-0 active:scale-95 ${
                      active
                        ? 'text-slate-950 bg-emerald-400/35 border-2 border-emerald-600/70 shadow-sm backdrop-blur-md'
                        : 'text-slate-950 hover:text-black hover:bg-black/10 border-2 border-transparent backdrop-blur-sm'
                    }`}
                  >
                    <span className="text-base xl:text-lg transition-transform group-hover:scale-110 flex-shrink-0">
                      {link.icon}
                    </span>
                    <span className="tracking-wide whitespace-nowrap leading-none select-none drop-shadow-sm text-slate-950 font-black">
                      {link.label}
                    </span>
                    
                    {link.isLive && (
                      <span className="flex h-2 w-2 relative ml-0.5 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-sm"></span>
                      </span>
                    )}

                    {link.isNew && (
                      <span className="text-[9px] uppercase font-black bg-blue-500/25 text-blue-200 border border-blue-400/40 px-1.5 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap shadow-sm backdrop-blur-md">
                        NEW
                      </span>
                    )}

                    {active && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* 3. RIGHT ZONE: Language, Theme (Image 2 style), Bell, QR Pass & User Profile */}
            <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 2xl:gap-3 flex-shrink-0 z-10">
              
              {/* 1. Trilingual Language Switcher Toggle */}
              <div className="flex items-center bg-black/10 backdrop-blur-xl border border-black/15 rounded-xl xl:rounded-2xl p-0.5 xl:p-1 shadow-inner flex-shrink-0 whitespace-nowrap">
                {languages.map((lang) => {
                  const isSelected = currentLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage(lang.code)}
                      className={`px-2 xl:px-2.5 py-1 text-[11px] xl:text-xs font-black rounded-lg xl:rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                        isSelected
                          ? 'bg-slate-950 text-white shadow-md font-black'
                          : 'text-slate-950 hover:text-black hover:bg-black/10'
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
                className={`relative flex items-center h-9 xl:h-10 px-1 rounded-full transition-all duration-300 cursor-pointer shadow-inner active:scale-95 flex-shrink-0 group ${
                  isLightMode
                    ? 'bg-slate-200 border border-slate-300 w-[88px] xl:w-[100px] justify-end'
                    : 'bg-white/10 backdrop-blur-xl border border-white/25 w-[88px] xl:w-[100px] justify-start shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]'
                }`}
                title={isLightMode ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
                aria-label="Toggle theme mode"
              >
                {/* Text Label */}
                <span
                  className={`text-[11px] xl:text-xs font-black tracking-wide select-none text-slate-950 ${
                    isLightMode
                      ? 'order-1 pl-2.5'
                      : 'order-2 pr-2.5 ml-auto'
                  }`}
                >
                  {isLightMode ? 'Dark' : 'Light'}
                </span>

                {/* 3D Liquid Glass Orb with glowing Moon/Sun icon */}
                <div
                  className={`w-7 h-7 xl:w-8 xl:h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    isLightMode
                      ? 'order-2 bg-gradient-to-br from-amber-200 to-amber-400 shadow-[0_2px_12px_rgba(251,191,36,0.6)] border border-amber-300 text-amber-950'
                      : 'order-1 bg-white/15 backdrop-blur-xl shadow-[0_4px_16px_rgba(255,255,255,0.25),inset_0_1px_2px_rgba(255,255,255,0.6)] border border-white/40 text-white'
                  }`}
                >
                  {isLightMode ? (
                    <svg className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-amber-600 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zm12.75 0a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM12 18.75a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM4.5 12a.75.75 0 01-.75.75H1.5a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM17.657 6.343a.75.75 0 011.06 0l1.592 1.591a.75.75 0 11-1.06 1.06l-1.592-1.59a.75.75 0 010-1.061zm-11.314 11.314a.75.75 0 011.06 0l1.592 1.591a.75.75 0 11-1.06 1.06l-1.592-1.59a.75.75 0 010-1.061zm12.374 1.591a.75.75 0 010 1.06l-1.592 1.592a.75.75 0 01-1.06-1.06l1.591-1.592a.75.75 0 011.061 0zm-11.314-11.314a.75.75 0 010 1.06L5.81 9.274a.75.75 0 11-1.06-1.06l1.591-1.592a.75.75 0 011.061 0z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.95)]" fill="currentColor" viewBox="0 0 24 24">
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
                  className="p-2 xl:p-2.5 rounded-xl xl:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 hover:border-white/40 text-slate-200 hover:text-white transition-all relative focus:outline-none shadow-sm flex-shrink-0 cursor-pointer active:scale-90"
                  title="Live Transit Alerts"
                  aria-label="View Transit Notifications"
                >
                  <span className="text-base xl:text-lg">🔔</span>
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                </button>

                {/* Live Transit Alerts Dropdown Popup */}
                {notificationsOpen && (
                  <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-slate-950/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-5 shadow-2xl z-50 animate-scale-in space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
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
                          className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 space-y-1 text-left"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${alert.tagColor}`}>
                              {alert.tag}
                            </span>
                            <span className="text-[10px] text-slate-400">{alert.time}</span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-100">{alert.title}</h5>
                          <p className="text-[11px] text-slate-300 leading-snug">{alert.desc}</p>
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

              {/* 4. Quick Access "📱 QR පාස්" Button */}
              <button
                type="button"
                onClick={() => onOpenQr ? onOpenQr() : setQrModalOpen(true)}
                className="px-2.5 xl:px-3 py-2 xl:py-2.5 rounded-xl xl:rounded-2xl bg-black/10 backdrop-blur-xl border border-black/15 hover:border-emerald-600 text-slate-950 font-black text-xs 2xl:text-sm tracking-wide shadow-sm flex items-center gap-1.5 active:scale-95 transition-all whitespace-nowrap flex-shrink-0 cursor-pointer"
                title="Open My Digital QR Pass"
              >
                <span className="text-base flex-shrink-0">📱</span>
                <span className="whitespace-nowrap font-black text-slate-950 hidden 2xl:inline">{getQrPassLabel()}</span>
                <span className="whitespace-nowrap font-black text-slate-950 2xl:hidden">QR</span>
              </button>

              {/* 5. USER PROFILE / LOGIN BUTTON (AT THE VERY FAR RIGHT EDGE) */}
              {isAuthenticated && user ? (
                <div className="relative flex-shrink-0" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-xl xl:rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-emerald-500/50 hover:border-emerald-400 text-white shadow-lg shadow-emerald-500/15 transition-all cursor-pointer active:scale-95"
                    title="User Profile & Account Options"
                  >
                    <span className="w-7 h-7 rounded-lg xl:rounded-xl bg-slate-950/80 border border-emerald-400/50 flex items-center justify-center text-sm xl:text-base flex-shrink-0">
                      {user.avatar || '👤'}
                    </span>
                    <div className="text-left hidden xl:block max-w-[110px]">
                      <p className="text-xs font-black text-slate-950 truncate leading-tight">
                        {user.fullName?.split(' ')[0] || 'Commuter'}
                      </p>
                      <span className="text-[10px] text-emerald-800 font-black block truncate leading-tight">
                        {user.userType === 'Student' ? '🎓 Student' : user.userType === 'Office Commuter' ? '💼 Office' : '👤 Commuter'}
                      </span>
                    </div>
                    <span className="text-xs text-slate-950 font-black">▾</span>
                  </button>

                  {/* Profile Dropdown Popup */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-3 w-72 bg-slate-950/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 shadow-2xl z-50 animate-scale-in space-y-3">
                      {/* Header Summary */}
                      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-2xl flex-shrink-0">
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

            {/* 4. COMPACT MOBILE TOP BAR (< md) & TABLET CONTROLS (md:flex xl:hidden) */}
            
            {/* MOBILE QUICK ACTION BAR (< md: visible on Android & iOS smartphones) */}
            <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
              
              {/* 1-Tap Call Button for 1955 Hotline */}
              <a
                href="tel:1955"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-black text-xs active:scale-95 transition-transform"
                title="Call 1955 Transport Hotline"
              >
                <span className="text-xs">📞</span>
                <span className="font-mono text-xs font-black">1955</span>
              </a>

              {/* Compact Language Switcher (සිං / EN / த) */}
              <div className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-0.5 shadow-inner">
                {[
                  { code: 'si', label: 'සිං' },
                  { code: 'en', label: 'EN' },
                  { code: 'ta', label: 'த' }
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLanguage(l.code)}
                    className={`px-2 py-1 text-[11px] font-black rounded-lg transition-all active:scale-95 cursor-pointer ${
                      currentLang === l.code
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {/* Dark/Light Mode Quick Toggle with spin/fade transition */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-90 ${
                  isLightMode
                    ? 'bg-amber-100 border border-amber-300 text-amber-600 shadow-amber-200/50'
                    : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white'
                }`}
                title={isLightMode ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
                aria-label="Toggle theme mode"
              >
                <div className="transform transition-transform duration-500 hover:rotate-180">
                  {isLightMode ? (
                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zm12.75 0a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM12 18.75a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM4.5 12a.75.75 0 01-.75.75H1.5a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM17.657 6.343a.75.75 0 011.06 0l1.592 1.591a.75.75 0 11-1.06 1.06l-1.592-1.59a.75.75 0 010-1.061zm-11.314 11.314a.75.75 0 011.06 0l1.592 1.591a.75.75 0 11-1.06 1.06l-1.592-1.59a.75.75 0 010-1.061zm12.374 1.591a.75.75 0 010 1.06l-1.592 1.592a.75.75 0 01-1.06-1.06l1.591-1.592a.75.75 0 011.061 0zm-11.314-11.314a.75.75 0 010 1.06L5.81 9.274a.75.75 0 11-1.06-1.06l1.591-1.592a.75.75 0 011.061 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                  )}
                </div>
              </button>

            </div>

            {/* TABLET CONTROLS (md:flex lg:hidden) */}
            <div className="hidden md:flex lg:hidden items-center gap-2">
              <a
                href="tel:1955"
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-black text-xs active:scale-95 transition-transform backdrop-blur-md"
              >
                <span>📞</span>
                <span className="font-mono text-xs font-black">1955</span>
              </a>

              <button
                type="button"
                onClick={() => onOpenQr ? onOpenQr() : setQrModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold text-xs"
              >
                📱 QR
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-sm text-white"
              >
                {isLightMode ? '☀️' : '🌙'}
              </button>

              {isAuthenticated && user ? (
                <Link
                  to="/profile"
                  className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-xl border border-emerald-500/40 flex items-center justify-center text-sm"
                >
                  {user.avatar || '👤'}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('phone')}
                  className="px-3 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs"
                >
                  👤 Login
                </button>
              )}

              {/* Tablet menu button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-slate-200"
              >
                ☰
              </button>
            </div>
          </div>

          {/* 5. MOBILE & TABLET HAMBURGER MENU DRAWER */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pt-4 border-t border-white/10 space-y-3 animate-fadeIn pb-3">
              
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
