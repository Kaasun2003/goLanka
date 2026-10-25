import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ currentLang, setLanguage, t }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t.home, icon: '🏠', localHint: 'මුල් පිටුව' },
    { to: '/tracker', label: t.liveTracker, icon: '🛰️', localHint: 'සජීවී සිතියම', isLive: true },
    { to: '/season', label: t.seasonPass, icon: '🎫', localHint: 'සීසන් පාස්' }
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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/90 transition-all duration-200 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-500/40 group-hover:border-emerald-400 transition-all bg-slate-900 flex items-center justify-center">
              <img
                src="/logo.jpg"
                alt="goLanka Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<span class="text-xl font-black text-emerald-400">gL</span>`;
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  go<span className="text-emerald-400">Lanka</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  🇱🇰 Transit
                </span>
              </div>
              <p className="text-[12px] text-slate-400 font-medium hidden sm:block">
                ශ්‍රී ලංකා ඩිජිටල් බස් ප්‍රවාහන සේවය
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2.5 ${
                  isActive(link.to)
                    ? 'text-white bg-slate-800 border border-emerald-500/50 shadow-md shadow-emerald-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
                {link.isLive && (
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Section: Language Switcher & Hotline */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1 shadow-inner">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    currentLang === lang.code
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  aria-label={`Switch language to ${lang.label}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Helpline Badge */}
            <div className="text-right pl-3 border-l border-slate-800">
              <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                24/7 SLTB Hotline
              </span>
              <a
                href="tel:1955"
                className="text-sm font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 justify-end transition-colors"
              >
                <span>📞</span> 1955
              </a>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Language switch on mobile */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                    currentLang === lang.code
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'text-slate-400'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 focus:outline-none"
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
          <div className="md:hidden py-4 border-t border-slate-800/90 space-y-2 animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-bold transition-all ${
                  isActive(link.to)
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{link.icon}</span>
                  <div>
                    <span className="block">{link.label}</span>
                    <span className="text-xs text-slate-400 font-normal">{link.localHint}</span>
                  </div>
                </div>
                {link.isLive && (
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
                    LIVE RADAR
                  </span>
                )}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-800/80 px-4 flex justify-between items-center text-xs text-slate-400">
              <span>National Transit Helpline:</span>
              <a href="tel:1955" className="text-amber-400 font-mono font-bold text-sm">
                📞 1955 (SLTB) / 1958
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
