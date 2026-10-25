import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ t = {}, currentLang = 'si' }) => {
  const getFooterDesc = () => {
    if (currentLang === 'en') {
      return "Sri Lanka's unified digital passenger transit ecosystem. Enabling real-time GPS tracking, electronic season passes, and schedule intelligence across all 25 administrative districts.";
    }
    if (currentLang === 'ta') {
      return "இலங்கையின் ஒருங்கிணைந்த டிஜிட்டல் பயணிகள் போக்குவரத்து அமைப்பு. நிகழ்நேர ஜிபிஎஸ் கண்காணிப்பு, மின்சார சீசன் பாஸ்கள் மற்றும் பயண அட்டவணைகள்.";
    }
    return "ශ්‍රී ලංකාවේ ඒකාබද්ධ ඩිජිටල් මගී ප්‍රවාහන ජාලය. සජීවී GPS ස්ථානගත කිරීම්, ඩිජිටල් වාර ප්‍රවේශපත්‍ර සහ දිවයිනේ සියලුම දිස්ත්‍රික්ක 25 ආවරණය වන පරිදි බස් කාලසටහන් සේවාව.";
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-400/40">
                <img
                  src="/logo.jpg"
                  alt="goLanka"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-red-800 to-amber-500 flex items-center justify-center font-bold text-white">GL</div>`;
                  }}
                />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                go<span className="text-emerald-400">Lanka</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {getFooterDesc()}
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Socket.io Fleet Active
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800">
                🇱🇰 Island-wide
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-amber-400/90">
              Passenger Portals
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/tracker" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>🛰️</span> Live GPS Tracker
                </Link>
              </li>
              <li>
                <Link to="/season" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>🎫</span> Digital Season Pass
                </Link>
              </li>
              <li>
                <a href="#booking" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>💺</span> Intercity Seat Hub
                </a>
              </li>
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <span>🗺️</span> Route Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Major Transit Hubs */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-amber-400/90">
              Major Hubs & Depots
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="text-slate-300 font-medium">Bastian Mawatha (Pettah)</li>
              <li className="text-slate-300 font-medium">Makumbura Multimodal (MTH)</li>
              <li className="text-slate-300 font-medium">Kandy Goods Shed Terminal</li>
              <li className="text-slate-300 font-medium">Galle Central Bus Station</li>
              <li className="text-slate-300 font-medium">Kurunegala Central Depot</li>
            </ul>
          </div>

          {/* Emergency & Transport Authorities */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-amber-400/90">
              Helplines & Authorities
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="block text-slate-400">SLTB 24/7 Hotline</span>
                <span className="text-amber-400 font-mono font-bold text-sm">📞 1955</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="block text-slate-400">National Transport Comm. (NTC)</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">📞 1958</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Data aligned with National Transport Commission standards.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{t.footerCopyright}</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Transit</span>
            <span>•</span>
            <span className="text-amber-400 font-medium">සිංහල / தமிழ் / English</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
