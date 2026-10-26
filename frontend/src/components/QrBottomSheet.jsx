import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const QrBottomSheet = ({ isOpen, onClose, t, currentLang }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { isLightMode } = useTheme();

  if (!isOpen) return null;

  const passNumber = user?.activeSeasonPassId || 'LK-SP-2026-8894';
  const commuterName = user?.fullName || 'Kasun Wijesinghe';
  const commuterType = user?.userType || 'Student';
  const commuterNic = user?.nicNumber || '200312345678';
  const commuterPhone = user?.phoneNumber || '+94 77 123 4567';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300 animate-fade-in">
      {/* Background dismissal overlay */}
      <div 
        className="fixed inset-0 cursor-pointer" 
        onClick={onClose}
        aria-label="Close bottom sheet"
      />

      {/* Slide-Up Bottom Sheet Card */}
      <div 
        className="relative z-10 w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-t-[32px] sm:rounded-3xl bg-slate-900 border-t-2 sm:border-2 border-emerald-500/40 p-5 sm:p-7 shadow-2xl animate-slide-up-sheet pb-safe text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Swipe Handle Indicator */}
        <div className="w-14 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header with Title and Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-lg">
              📱
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {currentLang === 'en' ? 'Digital QR Season Pass' : currentLang === 'ta' ? 'டிஜிட்டல் QR பாஸ்' : 'ඩිජිටල් QR සීසන් පාස්'}
              </h3>
              <p className="text-[11px] text-emerald-400 font-bold">
                {currentLang === 'en' ? 'Verified SLTB & NTC Commuter Pass' : currentLang === 'ta' ? 'சரிபார்க்கப்பட்ட SLTB & NTC பாஸ்' : 'සත්‍යාපිත ශ්‍රී ලංගම සහ ජා.ප්‍ර.කො පාස්'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-base active:scale-95 transition-transform"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Authenticated Pass Display vs Login Prompt */}
        {isAuthenticated ? (
          <div className="mt-5 space-y-5">
            {/* Holographic Digital Pass Body */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-emerald-500/50 p-5 shadow-xl">
              {/* Decorative Watermark / Hologram Badge */}
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />

              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-slate-950 border border-emerald-400/40 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
                    {user?.avatar || '👤'}
                  </span>
                  <div>
                    <h4 className="text-base font-black text-white leading-tight">{commuterName}</h4>
                    <span className="inline-block mt-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {commuterType === 'Student' ? '🎓 ශිෂ්‍ය (Student)' : commuterType === 'Office Commuter' ? '💼 කාර්යාල (Office)' : '👤 සාමාන්‍ය (General)'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500 text-slate-950 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                    VALID
                  </span>
                  <p className="text-[10px] font-mono text-slate-400 mt-1 font-bold">2026/10/31</p>
                </div>
              </div>

              {/* QR Code Presentation Box */}
              <div className="my-3 p-4 rounded-2xl bg-white flex flex-col items-center justify-center shadow-lg border-2 border-slate-200">
                {/* Clean, high-density native SVG QR representation */}
                <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center p-2 bg-white">
                  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                    {/* Corner Position Targets */}
                    <rect x="5" y="5" width="26" height="26" rx="4" fill="#020617" />
                    <rect x="9" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                    <rect x="13" y="13" width="10" height="10" rx="2" fill="#059669" />

                    <rect x="69" y="5" width="26" height="26" rx="4" fill="#020617" />
                    <rect x="73" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                    <rect x="77" y="13" width="10" height="10" rx="2" fill="#059669" />

                    <rect x="5" y="69" width="26" height="26" rx="4" fill="#020617" />
                    <rect x="9" y="73" width="18" height="18" rx="2" fill="#ffffff" />
                    <rect x="13" y="77" width="10" height="10" rx="2" fill="#059669" />

                    {/* Data Pattern Elements */}
                    <rect x="36" y="8" width="6" height="6" fill="#020617" />
                    <rect x="46" y="8" width="6" height="6" fill="#059669" />
                    <rect x="56" y="8" width="6" height="6" fill="#020617" />
                    <rect x="36" y="18" width="6" height="6" fill="#059669" />
                    <rect x="46" y="18" width="6" height="6" fill="#020617" />
                    <rect x="56" y="18" width="6" height="6" fill="#059669" />
                    <rect x="36" y="28" width="6" height="6" fill="#020617" />

                    <rect x="8" y="36" width="6" height="6" fill="#059669" />
                    <rect x="18" y="36" width="6" height="6" fill="#020617" />
                    <rect x="28" y="36" width="6" height="6" fill="#059669" />
                    <rect x="8" y="46" width="6" height="6" fill="#020617" />
                    <rect x="18" y="46" width="6" height="6" fill="#059669" />

                    <rect x="68" y="36" width="6" height="6" fill="#020617" />
                    <rect x="78" y="36" width="6" height="6" fill="#059669" />
                    <rect x="88" y="36" width="6" height="6" fill="#020617" />
                    <rect x="68" y="46" width="6" height="6" fill="#059669" />
                    <rect x="78" y="46" width="6" height="6" fill="#020617" />

                    {/* Center Core Logo */}
                    <rect x="41" y="41" width="18" height="18" rx="4" fill="#020617" />
                    <text x="50" y="53" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="900" fontFamily="sans-serif">gL</text>

                    {/* Bottom Data Cells */}
                    <rect x="36" y="68" width="6" height="6" fill="#020617" />
                    <rect x="46" y="68" width="6" height="6" fill="#059669" />
                    <rect x="56" y="68" width="6" height="6" fill="#020617" />
                    <rect x="68" y="68" width="6" height="6" fill="#020617" />
                    <rect x="78" y="68" width="6" height="6" fill="#059669" />
                    <rect x="36" y="78" width="6" height="6" fill="#059669" />
                    <rect x="46" y="78" width="6" height="6" fill="#020617" />
                    <rect x="56" y="78" width="6" height="6" fill="#059669" />
                    <rect x="68" y="78" width="6" height="6" fill="#059669" />
                    <rect x="88" y="78" width="6" height="6" fill="#020617" />
                    <rect x="36" y="88" width="6" height="6" fill="#020617" />
                    <rect x="56" y="88" width="6" height="6" fill="#020617" />
                    <rect x="78" y="88" width="6" height="6" fill="#020617" />
                  </svg>
                </div>

                <p className="text-[11px] font-mono font-black text-slate-800 tracking-wider mt-1 select-all">
                  {passNumber}
                </p>
                <span className="text-[10px] text-slate-500 font-medium">
                  {currentLang === 'en' ? 'Present this QR to Conductor on bus boarding' : 'බස් රථයට නැගීමේදී කොන්දොස්තර මහතාට පෙන්වන්න'}
                </span>
              </div>

              {/* Pass Details Table */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">NIC Number</span>
                  <span className="font-mono font-bold text-slate-200">{commuterNic}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Mobile</span>
                  <span className="font-mono font-bold text-slate-200">{commuterPhone}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => alert('Digital Season Pass QR has been saved to your photo gallery!')}
                className="min-h-[48px] py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <span>💾</span>
                <span>{currentLang === 'en' ? 'Save to Gallery' : 'Save QR'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="min-h-[48px] py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
              >
                <span>✕</span>
                <span>{currentLang === 'en' ? 'Close' : 'වසන්න'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Guest State: Prompt 1-Tap Login */
          <div className="mt-6 py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-950 border border-emerald-500/40 flex items-center justify-center text-3xl mx-auto shadow-inner">
              🎫
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">
                {currentLang === 'en' ? 'Digital Season Pass' : 'ඩිජිටල් සීසන් පාස් එක'}
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                {currentLang === 'en' 
                  ? 'Please login with your mobile number to view and use your verified Digital QR Pass instantly.' 
                  : 'ඔබගේ ඩිජිටල් QR පාස් එක ලබාගැනීමට කරුණාකර දුරකථන අංකයෙන් ලොග් වන්න.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                openAuthModal('phone');
              }}
              className="min-h-[48px] w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-95 transition-transform"
            >
              <span>👤</span>
              <span>{currentLang === 'en' ? 'Quick Login with Mobile' : 'දුරකථන අංකයෙන් ඇතුල්වන්න'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrBottomSheet;
