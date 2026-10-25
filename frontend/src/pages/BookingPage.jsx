import React from 'react';
import SeatBookingHub from '../components/SeatBookingHub.jsx';

const BookingPage = ({ t, currentLang = 'si' }) => {
  const getPageTitle = () => {
    if (currentLang === 'en') return 'Expressway & Intercity Seat Reservation';
    if (currentLang === 'ta') return 'அதிவேக நெடுஞ்சாலை மற்றும் நீண்ட தூர இருக்கை முன்பதிவு';
    return 'අධිවේගී හා දුරගමන් ආසන වෙන්කිරීම';
  };

  const getPageDesc = () => {
    if (currentLang === 'en') {
      return 'Book seats in advance on long-distance luxury coaches and Southern Expressway buses across Sri Lanka via official government and private transit gateways.';
    }
    if (currentLang === 'ta') {
      return 'அரசு மற்றும் தனியார் போக்குவரத்து வாயில்கள் மூலம் இலங்கை முழுவதும் உள்ள தொலைதூர சொகுசு பேருந்துகளில் முன்கூட்டியே இருக்கைகளை முன்பதிவு செய்யுங்கள்.';
    }
    return 'ලංගම සහ පෞද්ගලික ප්‍රවාහන ද්වාර හරහා දිවයින පුරා ධාවනය වන අධිවේගී සහ දුරගමන් සුඛෝපභෝගී බස් රථවල ආසන කලින්ම වෙන්කරවා ගන්න.';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
          <span>💺</span>
          <span>
            {currentLang === 'en'
              ? 'Official Intercity Seat Reservations'
              : currentLang === 'ta'
              ? 'அதிகாரப்பூர்வ இருக்கை முன்பதிவு'
              : 'නිල ආසන වෙන්කිරීමේ ද්වාරය'}
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {getPageTitle()}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {getPageDesc()}
        </p>
      </div>

      {/* Embedded Seat Booking Hub */}
      <SeatBookingHub t={t} currentLang={currentLang} />
    </div>
  );
};

export default BookingPage;
