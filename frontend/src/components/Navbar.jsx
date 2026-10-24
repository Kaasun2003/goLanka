import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ currentLang, setLanguage, t }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t.home, icon: '🏠' },
    { to: '/tracker', label: t.liveTracker, icon: '🛰️', badge: 'LIVE' },
    { to: '/season', label: t.seasonPass, icon: '🎫' },
    { to: '/#booking', label: t.seatBooking, icon: '💺' }
  ];

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'si', label: 'සිංහල', flag: '🇱🇰' },
    { code: 'ta', label: 'தமிழ்', flag: '🇱🇰' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-lg border border-amber-400/30 group-hover:border-amber-400 transition-colors">
              <img
                src="/logo.jpg"
                alt="goLanka Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-red-800 to-amber-500 flex items-center justify-center font-bold text-white text-lg">GL</div>`;
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  go<span className="text-amber-400">Lanka</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-red-900/60 text-red-200 border border-red-700/50 px-2 py-0.5 rounded-full">
                  🇱🇰 Transit
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                ශ්‍රී ලංකා බස් ප්‍රවාහන ඩිජිටල් ජාලය
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${
                  isActive(link.to)
                    ? 'text-white bg-slate-800/90 shadow-sm border border-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
                {link.badge && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Language Switcher & Hotline */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                    currentLang === lang.code
                      ? 'bg-amber-400 text-slate-950 shadow font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <div className="text-right pl-2 border-l border-slate-800">
              <span className="block text-[10px] text-slate-400 uppercase font-semibold">24/7 SLTB Line</span>
              <span className="text-xs font-mono font-bold text-amber-400">📞 1955</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-md p-0.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                    currentLang === lang.code ? 'bg-amber-400 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  {lang.code.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800/80 space-y-2 animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold ${
                  isActive(link.to)
                    ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-800/60 px-4 flex justify-between items-center text-xs text-slate-400">
              <span>National Transit Helpline</span>
              <span className="text-amber-400 font-mono font-bold">1955 / 1958</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
