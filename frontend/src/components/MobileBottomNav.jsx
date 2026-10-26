import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const MobileBottomNav = ({ onOpenQr, currentLang, t }) => {
  const location = useLocation();
  const { isAuthenticated, user, openAuthModal } = useAuth();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Trilingual tab labels
  const getLabel = (key) => {
    switch (key) {
      case 'home':
        return currentLang === 'en' ? 'Home' : currentLang === 'ta' ? 'முகப்பு' : 'මුල් පිටුව';
      case 'radar':
        return currentLang === 'en' ? 'Live Radar' : currentLang === 'ta' ? 'நேரலை' : 'සජීවී සිතියම';
      case 'qr':
        return currentLang === 'en' ? 'QR Pass' : currentLang === 'ta' ? 'QR பாஸ்' : 'QR පාස්';
      case 'booking':
        return currentLang === 'en' ? 'Seats' : currentLang === 'ta' ? 'இருக்கை' : 'ආසන';
      case 'account':
        if (!isAuthenticated) {
          return currentLang === 'en' ? 'Login' : currentLang === 'ta' ? 'உள்நுழை' : 'ගිණුම';
        }
        return user?.fullName?.split(' ')[0] || (currentLang === 'en' ? 'Account' : 'ගිණුම');
      default:
        return '';
    }
  };

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 mobile-bottom-nav backdrop-blur-2xl bg-slate-950/95 border-t border-slate-800/90 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] px-2 pt-2 pb-safe select-none transition-colors duration-300"
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        
        {/* Tab 1: Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1.5 touch-press active:scale-95 transition-all ${
            isActive('/') ? 'text-emerald-400 font-black' : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <span className="text-xl transition-transform leading-none mb-1">🏠</span>
          <span className="text-[10px] tracking-tight truncate max-w-[64px]">
            {getLabel('home')}
          </span>
          {isActive('/') && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5 animate-pulse" />
          )}
        </Link>

        {/* Tab 2: Live Radar Map */}
        <Link
          to="/tracker"
          className={`flex flex-col items-center justify-center py-1.5 touch-press active:scale-95 transition-all relative ${
            isActive('/tracker') ? 'text-emerald-400 font-black' : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <span className="text-xl transition-transform leading-none mb-1 relative">
            🛰️
            <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </span>
          <span className="text-[10px] tracking-tight truncate max-w-[64px]">
            {getLabel('radar')}
          </span>
          {isActive('/tracker') && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5 animate-pulse" />
          )}
        </Link>

        {/* Tab 3: Center Elevated Floating QR Action Button */}
        <div className="flex flex-col items-center justify-center -mt-6">
          <button
            type="button"
            onClick={onOpenQr}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 flex flex-col items-center justify-center shadow-xl shadow-emerald-500/40 border-4 border-slate-950 active:scale-90 transition-transform cursor-pointer group"
            title="Open Digital QR Season Pass"
            aria-label="Open Digital QR Season Pass"
          >
            <span className="text-2xl leading-none transition-transform group-hover:scale-110">📱</span>
          </button>
          <span className="text-[10px] font-black text-emerald-400 tracking-tight mt-1 truncate">
            {getLabel('qr')}
          </span>
        </div>

        {/* Tab 4: Seat Booking */}
        <Link
          to="/booking"
          className={`flex flex-col items-center justify-center py-1.5 touch-press active:scale-95 transition-all relative ${
            isActive('/booking') ? 'text-emerald-400 font-black' : 'text-slate-400 hover:text-slate-200 font-medium'
          }`}
        >
          <span className="text-xl transition-transform leading-none mb-1 relative">
            💺
            <span className="absolute -top-1 -right-2 text-[8px] font-black bg-blue-500 text-white px-1 rounded-full leading-tight">
              NEW
            </span>
          </span>
          <span className="text-[10px] tracking-tight truncate max-w-[64px]">
            {getLabel('booking')}
          </span>
          {isActive('/booking') && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5 animate-pulse" />
          )}
        </Link>

        {/* Tab 5: Account / Login */}
        {isAuthenticated ? (
          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center py-1.5 touch-press active:scale-95 transition-all ${
              isActive('/profile') ? 'text-emerald-400 font-black' : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <span className="text-xl transition-transform leading-none mb-1">
              {user?.avatar || '👤'}
            </span>
            <span className="text-[10px] tracking-tight truncate max-w-[64px]">
              {getLabel('account')}
            </span>
            {isActive('/profile') && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5 animate-pulse" />
            )}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal('phone')}
            className="flex flex-col items-center justify-center py-1.5 touch-press active:scale-95 transition-all text-slate-400 hover:text-emerald-400 font-medium"
          >
            <span className="text-xl leading-none mb-1">👤</span>
            <span className="text-[10px] tracking-tight truncate max-w-[64px]">
              {getLabel('account')}
            </span>
          </button>
        )}

      </div>
    </nav>
  );
};

export default MobileBottomNav;
