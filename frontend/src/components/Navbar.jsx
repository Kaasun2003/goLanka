import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ currentLang, setLanguage, t }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t.home || 'Home', icon: '🏠', localHint: 'මුල් පිටුව' },
    { to: '/tracker', label: t.liveTracker || 'Live Bus Tracker', icon: '🛰️', localHint: 'සජීවී සිතියම', isLive: true },
    { to: '/season', label: t.seasonPass || 'Digital Season Pass', icon: '🎫', localHint: 'සීසන් පාස්' }
  ];

  const languages = [
    { code: 'si', label: 'සිංහල' },
    { code: 'en', label: 'ENG' },
    { code: 'ta', label: 'தமிழ்' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/95 border-b border-slate-800/90 shadow-2xl transition-all">
      {/* Expanded wide container for spacious breathing room across all screens */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-24">
          
          {/* 1. LEFT ZONE: Brand Logo & Identification */}
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

          {/* 2. CENTER ZONE: Spacious, Well-Spread Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`group relative px-5 py-3 rounded-2xl text-[15px] xl:text-base font-bold transition-all duration-200 flex items-center gap-3 ${
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

                  {/* Active bottom accent bar */}
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-emerald-400 rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. RIGHT ZONE: Language Switcher & Transit Helpline */}
          <div className="hidden md:flex items-center gap-6 xl:gap-8 flex-shrink-0">
            
            {/* Trilingual Switcher Toggle */}
            <div className="flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1.5 shadow-inner">
              {languages.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
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

            {/* Helpline Box */}
            <div className="pl-5 border-l border-slate-800 text-right">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                24/7 SLTB Hotline
              </span>
              <a
                href="tel:1955"
                className="text-base font-mono font-black text-amber-400 hover:text-amber-300 flex items-center gap-1.5 justify-end transition-colors"
                title="Call SLTB Passenger Helpline"
              >
                <span>📞</span>
                <span>1955</span>
              </a>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-3">
            {/* Language toggle on mobile */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    currentLang === lang.code
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'text-slate-400'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 rounded-2xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 focus:outline-none shadow-md"
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

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-5 border-t border-slate-800/90 space-y-3 animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl text-base font-bold transition-all ${
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
              </Link>
            ))}

            <div className="pt-4 border-t border-slate-800/80 px-4 flex justify-between items-center text-sm text-slate-400">
              <span>National Transit Helpline:</span>
              <a href="tel:1955" className="text-amber-400 font-mono font-bold text-base flex items-center gap-1">
                <span>📞</span> 1955 (SLTB) / 1958
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
