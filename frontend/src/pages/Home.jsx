import React from 'react';
import { useNavigate } from 'react-router-dom';
import JourneyPlanner from '../components/JourneyPlanner.jsx';
import SeatBookingHub from '../components/SeatBookingHub.jsx';

const Home = ({ t }) => {
  const navigate = useNavigate();

  const transitHighlights = [
    {
      icon: '🛰️',
      title: 'Real-Time GPS Fleet Radar',
      titleLocal: 'සජීවී බස් ස්ථානය',
      desc: 'Accurate WebSocket-powered positioning for SLTB and private route buses with live ETA calculations.'
    },
    {
      icon: '🎫',
      title: 'Digital Season Pass (සීසන්)',
      titleLocal: 'ඩිජිටල් වාර ප්‍රවේශපත්‍ර',
      desc: 'Subsidized online transit passes for school students, university undergraduates, and government staff with QR codes.'
    },
    {
      icon: '⛰️',
      title: 'Low-Signal Resilience',
      titleLocal: 'දුරස්ථ ප්‍රදේශ ආවරණය',
      desc: 'Smart caching shows Last Known Location during cellular drops in mountainous passes like Kadugannawa and Ella.'
    },
    {
      icon: '💺',
      title: 'Unified Seat Booking Hub',
      titleLocal: 'අන්තර්නගර ආසන වෙන්කිරීම',
      desc: 'Seamless gateway linking directly to SLTB e-Sheet, NCG Express, and Magiya long-distance coach networks.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-12 text-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-red-800/20 via-amber-500/15 to-emerald-600/15 blur-3xl pointer-events-none rounded-full"></div>

        <div className="relative max-w-4xl mx-auto px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-amber-400">🇱🇰 Sri Lanka's Official Digital Transit Network</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            {t.heroTitle}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/tracker')}
              className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm tracking-wide shadow-xl hover:shadow-amber-400/20 transition-all flex items-center gap-2"
            >
              <span>🛰️</span> Launch Live Map Tracker
            </button>
            <button
              onClick={() => navigate('/season')}
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm tracking-wide transition-all flex items-center gap-2"
            >
              <span>🎫</span> Apply for Season Pass
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-slate-900 max-w-3xl mx-auto">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <span className="text-2xl font-black text-amber-400 font-mono block">1,850+</span>
              <span className="text-xs text-slate-400 font-medium">Active Fleet Buses</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <span className="text-2xl font-black text-white font-mono block">9</span>
              <span className="text-xs text-slate-400 font-medium">Provinces Covered</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <span className="text-2xl font-black text-emerald-400 font-mono block">~5-10s</span>
              <span className="text-xs text-slate-400 font-medium">GPS Sync Rate</span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <span className="text-2xl font-black text-amber-400 font-mono block">100%</span>
              <span className="text-xs text-slate-400 font-medium">Digital QR Passes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Planner Section */}
      <section className="px-4">
        <JourneyPlanner t={t} />
      </section>

      {/* Transit Capabilities / Features */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Why goLanka?</span>
          <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
            Engineered for Sri Lankan Road Conditions
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Tailored to handle battery constraints on driver smartphones and intermittent cellular connectivity across island mountain corridors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {transitHighlights.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/70 border border-slate-800 hover:border-amber-400/50 rounded-2xl p-6 transition-all shadow-lg hover:shadow-xl space-y-3"
            >
              <div className="text-3xl">{item.icon}</div>
              <h3 className="text-lg font-bold text-white tracking-tight">{item.title}</h3>
              <p className="text-xs text-amber-400 font-medium">{item.titleLocal}</p>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seat Booking Hub */}
      <section className="px-4">
        <SeatBookingHub t={t} />
      </section>
    </div>
  );
};

export default Home;
