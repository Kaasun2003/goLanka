import React from 'react';

const partners = [
  {
    id: 'sltb',
    name: 'SLTB e-Sheet Portal',
    nameLocal: 'ශ්‍රී ලංගම නිල ආසන වෙන්කිරීම',
    badge: 'Government Official',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/30',
    description: 'Official digital seat booking system for Sri Lanka Transport Board (SLTB/CTB) long-distance & expressway coaches.',
    popularRoutes: ['Colombo - Jaffna', 'Colombo - Badulla', 'Makumbura - Galle', 'Colombo - Kataragama'],
    linkUrl: 'https://eservices.sltb.lk/',
    buttonText: 'Book via SLTB e-Sheet →'
  },
  {
    id: 'ncg',
    name: 'NCG Express',
    nameLocal: 'එන්.සී.ජී සුඛෝපභෝගී සේවාව',
    badge: 'Luxury Highway Coach',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    description: 'Premier air-conditioned expressway transport service connecting Western Province to Northern & Eastern Provinces.',
    popularRoutes: ['Colombo - Jaffna Super Luxury', 'Colombo - Trincomalee', 'Colombo - Batticaloa'],
    linkUrl: 'https://www.ncgexpress.lk/',
    buttonText: 'Book on NCG Express →'
  },
  {
    id: 'magiya',
    name: 'Magiya Bus Portal',
    nameLocal: 'මගියා බස් සේවාව',
    badge: 'Private Fleet Partner',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    description: 'Unified online ticket reservation network aggregating licensed private bus operators island-wide.',
    popularRoutes: ['Colombo - Kandy AC', 'Colombo - Nuwara Eliya', 'Colombo - Anuradhapura'],
    linkUrl: 'https://magiya.lk/',
    buttonText: 'Book via Magiya →'
  },
  {
    id: 'busseat',
    name: 'BusSeat.lk',
    nameLocal: 'බස්සීට් වෙන්කිරීම්',
    badge: 'Multi-Operator Gateway',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    description: 'Interactive seat layout booking with instant SMS ticket confirmations and local bank debit card support.',
    popularRoutes: ['Colombo - Ampara', 'Colombo - Bandarawela', 'Kandy - Matara Expressway'],
    linkUrl: 'https://busseat.lk/',
    buttonText: 'Reserve on BusSeat.lk →'
  }
];

const SeatBookingHub = ({ t }) => {
  return (
    <div id="booking" className="w-full max-w-6xl mx-auto py-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/30">
          <span>💺</span>
          <span>Intercity & Expressway Seat Reservation</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Centralized Seat Booking Hub
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Direct integrated gateway to Sri Lanka’s authorized online booking portals. Reserve your seat in advance for highway luxury coaches and overnight inter-provincial journeys.
        </p>
      </div>

      {/* Partner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 sm:p-7 transition-all shadow-xl hover:shadow-2xl flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    {partner.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    {partner.nameLocal}
                  </p>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${partner.badgeColor}`}>
                  {partner.badge}
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {partner.description}
              </p>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Key Express Routes:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {partner.popularRoutes.map((route, i) => (
                    <span
                      key={i}
                      className="text-xs bg-slate-950 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 font-medium"
                    >
                      {route}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <a
                href={partner.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-200 text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md group-hover:bg-amber-400 group-hover:text-slate-950"
              >
                <span>{partner.buttonText}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Advisory Notice */}
      <div className="mt-8 bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 sm:p-5 flex items-start gap-4 text-xs text-slate-400">
        <span className="text-xl">ℹ️</span>
        <div>
          <strong className="text-slate-200 block mb-0.5">Sri Lanka Transit Advisory for Long-Distance Commuters:</strong>
          For festive seasons (Sinhala & Tamil New Year, Poson, Vesak, Christmas) and long weekends, please reserve seats at least 7 to 14 days in advance via SLTB e-Sheet or partner counters at Bastian Mawatha Bus Terminal, Pettah.
        </div>
      </div>
    </div>
  );
};

export default SeatBookingHub;
