import React from 'react';
import SeatBookingHub from '../components/SeatBookingHub.jsx';

const BookingPage = ({ t }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
          <span>💺</span>
          <span>Official Intercity Seat Reservations</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          අධිවේගී හා දුරගමන් ආසන වෙන්කිරීම
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Book seats in advance on long-distance luxury coaches and Southern Expressway buses across Sri Lanka via official government and private transit gateways.
        </p>
      </div>

      {/* Embedded Seat Booking Hub */}
      <SeatBookingHub t={t} />
    </div>
  );
};

export default BookingPage;
