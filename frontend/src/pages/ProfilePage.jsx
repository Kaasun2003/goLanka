import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProfilePage = ({ t, currentLang = 'si' }) => {
  const { user, isAuthenticated, openAuthModal, logout, renewSeasonPass, removeRoute, loading } = useAuth();
  const navigate = useNavigate();

  const [renewing, setRenewing] = useState(false);
  const [renewNotice, setRenewNotice] = useState(null);
  const [copiedQr, setCopiedQr] = useState(false);
  const [qrZoomed, setQrZoomed] = useState(false);

  // If user is not logged in, show an inviting login prompt card
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6 bg-slate-950 text-slate-100">
        <div className="w-full max-w-lg bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-fade-in-up">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-4xl shadow-inner">
            👤
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {currentLang === 'si'
                ? 'මගී ගිණුමට පිවිසෙන්න'
                : currentLang === 'ta'
                ? 'பயனர் கணக்கில் உள்நுழைக'
                : 'Sign in to Your goLanka Account'}
            </h2>
            <p className="text-sm text-slate-400">
              {currentLang === 'si'
                ? 'ඩිජිටල් සීසන් පාස්, සුරකින ලද බස් මාර්ග සහ ආසන වෙන්කිරීම් පරීක්ෂා කිරීමට කරුණාකර පිවිසෙන්න.'
                : currentLang === 'ta'
                ? 'டிஜிட்டல் பாஸ்கள், சேமித்த வழிகள் மற்றும் முன்பதிவுகளைக் காண உள்நுழையவும்.'
                : 'Access your active digital QR season passes, favorite bus corridors, and booking history.'}
            </p>
          </div>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => openAuthModal('phone')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>📱</span>
              <span>{t.quickPhoneLogin || 'Quick Mobile Login (OTP)'}</span>
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('email')}
              className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border-2 border-slate-700 text-white font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>✉️</span>
              <span>{t.emailPasswordLogin || 'Email & Password Login'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle 1-Click Season Pass Renewal
  const handleRenewPass = async () => {
    setRenewing(true);
    setRenewNotice(null);
    const result = await renewSeasonPass();
    setRenewing(false);
    if (result.success) {
      setRenewNotice({
        type: 'success',
        text: t.renewSuccess || 'Season Pass renewed successfully for next month!'
      });
      setTimeout(() => setRenewNotice(null), 5000);
    } else {
      setRenewNotice({
        type: 'error',
        text: result.message || 'Renewal failed. Please contact SLTB Helpline 1955.'
      });
    }
  };

  const pass = user.activeSeasonPass;

  // Copy QR token
  const handleCopyQr = () => {
    if (pass?.qrCodeToken) {
      navigator.clipboard?.writeText(pass.qrCodeToken);
      setCopiedQr(true);
      setTimeout(() => setCopiedQr(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Top Banner / Breadcrumb */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              🇱🇰 Verified Sri Lankan Commuter
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">ID: {user._id || 'GL-8921'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t.profileTitle || 'User Profile & Transit Hub'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t.profileSubtitle || 'Manage your digital season pass, view live tracking of saved routes, and manage bookings.'}
          </p>
        </div>

        {/* Action Buttons: Logout & Switch Account */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openAuthModal('phone')}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <span>🔄</span>
            <span>Switch Account</span>
          </button>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-4 py-2.5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <span>🚪</span>
            <span>{t.logout || 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Details Card & Active Season Pass Card */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 min-w-0">
        
        {/* LEFT COLUMN: User Details Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6 min-w-0">
          <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden animate-scale-in">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

            {/* Avatar & Commuter Category Badge */}
            <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-slate-950 to-slate-800 border-2 border-emerald-500/40 flex items-center justify-center text-4xl shadow-xl flex-shrink-0">
                {user.avatar || '👤'}
              </div>
              <div className="space-y-1 truncate">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm">
                  {user.userType === 'Student'
                    ? '🎓 Student Commuter'
                    : user.userType === 'Office Commuter'
                    ? '💼 Office Commuter'
                    : '👤 General Commuter'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white truncate">
                  {user.fullName}
                </h3>
                <p className="text-xs text-slate-400 font-mono truncate">{user.phoneNumber}</p>
              </div>
            </div>

            {/* Commuter Information Specs */}
            <div className="py-5 space-y-3.5 text-sm">
              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
                <span className="text-slate-400 text-xs font-bold">{t.nicNumber || 'National ID (NIC)'}</span>
                <span className="font-mono font-bold text-slate-200">{user.nicNumber || '200428901234'}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
                <span className="text-slate-400 text-xs font-bold">{t.email || 'Email Address'}</span>
                <span className="font-medium text-slate-200 text-xs truncate max-w-[180px]">{user.email || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-800/60 pb-2.5">
                <span className="text-slate-400 text-xs font-bold">{t.phoneNumber || 'Phone Verified'}</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold">
                  <span>✓</span>
                  <span>Active & Verified</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-bold">SLTB Transit Depot</span>
                <span className="font-bold text-amber-300 text-xs">Maharagama / Pettah Depot</span>
              </div>
            </div>

            {/* 75% Student Subsidy Banner */}
            {user.userType === 'Student' && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-emerald-950/60 border border-blue-500/30 flex items-center gap-3">
                <span className="text-2xl">🎓</span>
                <div className="text-left">
                  <p className="text-xs font-bold text-blue-300">
                    {t.studentSubsidyActive || '75% Student Subsidy Active'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Sri Lanka Transport Board (SLTB) Concessionary Transit Scheme
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Helpline Support Box for 15-50 Users */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <span>📞</span>
              <span>24/7 Commuter Helpline & Inquiries</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="tel:1955"
                className="p-3 bg-slate-950 rounded-2xl border border-slate-800 hover:border-amber-500/50 block text-center transition-all group"
              >
                <span className="text-lg block">🚌</span>
                <span className="font-bold text-white group-hover:text-amber-400">1955 (SLTB)</span>
                <span className="text-[10px] text-slate-500 block">Bus Inquiries</span>
              </a>
              <a
                href="tel:1958"
                className="p-3 bg-slate-950 rounded-2xl border border-slate-800 hover:border-blue-500/50 block text-center transition-all group"
              >
                <span className="text-lg block">🏛️</span>
                <span className="font-bold text-white group-hover:text-blue-400">1958 (NTC)</span>
                <span className="text-[10px] text-slate-500 block">Complaints</span>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Digital Season Pass & Quick Renew (8 cols) */}
        <div className="lg:col-span-8 space-y-6 min-w-0">
          
          {/* Renewal Status Notice Banner */}
          {renewNotice && (
            <div
              className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 animate-scale-in ${
                renewNotice.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200 shadow-xl shadow-emerald-500/10'
                  : 'bg-rose-950/80 border-rose-500/60 text-rose-200 shadow-xl shadow-rose-500/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{renewNotice.type === 'success' ? '🎉' : '⚠️'}</span>
                <p className="text-sm font-bold">{renewNotice.text}</p>
              </div>
              <button
                type="button"
                onClick={() => setRenewNotice(null)}
                className="text-xs font-bold hover:underline cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
          )}

          {/* ACTIVE DIGITAL SEASON PASS CARD (HERO TICKET DESIGN) */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-scale-in">
            {/* Background Decorative Rings */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header: Pass Title & Status Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {pass?.passType || 'SLTB Digital Season Pass'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    No: {pass?.applicationNumber || 'GL-SC-789012'}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {t.activeSeasonPass || 'Active Digital Season Pass'}
                </h2>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-black text-xs shadow-inner">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{pass?.approvalStatus || 'Approved & Issued'}</span>
              </div>
            </div>

            {/* Pass Body: Route, Validity, and Scannable QR Code */}
            <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Route & Validity Details (7 cols) */}
              <div className="md:col-span-7 space-y-4 text-left">
                
                {/* Route Designation */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Designated Bus Route
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-black font-mono text-sm border border-emerald-500/40">
                      Route {pass?.routeNumber || '138'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex-1">
                      <span className="text-[10px] text-slate-400 uppercase block">From (Origin)</span>
                      <span className="text-sm font-black text-white truncate block">
                        {pass?.travelOrigin || 'Maharagama Clock Tower'}
                      </span>
                    </div>
                    <span className="text-emerald-400 font-bold text-lg">⇄</span>
                    <div className="flex-1 text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">To (Destination)</span>
                      <span className="text-sm font-black text-white truncate block">
                        {pass?.travelDestination || 'Pettah / Maradana'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Validity Period & Subsidized Fare */}
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      {t.validUntilDate || 'Valid Until'}
                    </span>
                    <span className="text-sm sm:text-base font-black text-emerald-300 font-mono block">
                      {pass?.validUntil || '2026-06-30'}
                    </span>
                    <span className="text-[10px] text-emerald-400/80 block font-medium">Auto-renew active</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Monthly Fare (Subsidized)
                    </span>
                    <span className="text-sm sm:text-base font-black text-amber-300 font-mono block">
                      Rs. {pass?.fareAmountLKR || 180}.00
                    </span>
                    <span className="text-[10px] text-blue-400 block font-medium">Govt Subsidy: 75%</span>
                  </div>
                </div>

                {/* Passenger Name & NIC on Pass */}
                <div className="flex items-center justify-between px-3 text-xs text-slate-400">
                  <span>Holder: <strong className="text-slate-200">{user.fullName}</strong></span>
                  <span>NIC: <strong className="text-slate-200">{user.nicNumber}</strong></span>
                </div>
              </div>

              {/* Scannable Digital QR Display (5 cols) */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-5 bg-slate-950 rounded-3xl border-2 border-emerald-500/40 shadow-inner space-y-3">
                <div className="text-center space-y-0.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                    📱 SLTB Conductor QR
                  </span>
                  <p className="text-[10px] text-slate-400">Show to bus conductor on boarding</p>
                </div>

                {/* Scannable QR Graphic */}
                <div
                  onClick={() => setQrZoomed(!qrZoomed)}
                  className="p-3 bg-white rounded-2xl shadow-xl border-4 border-emerald-400 cursor-pointer transform hover:scale-105 transition-all group"
                  title="Click to Zoom QR Code"
                >
                  {/* Clean SVG QR Code */}
                  <svg className="w-36 h-36 sm:w-40 sm:h-40" viewBox="0 0 100 100">
                    {/* Corner Squares */}
                    <rect x="5" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                    <rect x="9" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                    <rect x="13" y="13" width="12" height="12" fill="#0f172a" rx="1" />

                    <rect x="67" y="5" width="28" height="28" fill="#0f172a" rx="4" />
                    <rect x="71" y="9" width="20" height="20" fill="#ffffff" rx="2" />
                    <rect x="75" y="13" width="12" height="12" fill="#0f172a" rx="1" />

                    <rect x="5" y="67" width="28" height="28" fill="#0f172a" rx="4" />
                    <rect x="9" y="71" width="20" height="20" fill="#ffffff" rx="2" />
                    <rect x="13" y="75" width="12" height="12" fill="#0f172a" rx="1" />

                    {/* Data Matrix Dots */}
                    <rect x="38" y="10" width="6" height="6" fill="#059669" rx="1" />
                    <rect x="48" y="10" width="6" height="6" fill="#0f172a" rx="1" />
                    <rect x="56" y="15" width="6" height="6" fill="#0f172a" rx="1" />
                    <rect x="38" y="22" width="6" height="6" fill="#0f172a" rx="1" />
                    <rect x="48" y="25" width="6" height="6" fill="#059669" rx="1" />

                    <rect x="10" y="42" width="6" height="6" fill="#0f172a" rx="1" />
                    <rect x="20" y="45" width="6" height="6" fill="#059669" rx="1" />
                    <rect x="28" y="40" width="6" height="6" fill="#0f172a" rx="1" />
                    <rect x="38" y="42" width="6" height="6" fill="#0f172a" rx="1" />
                    <rect x="48" y="42" width="6" height="6" fill="#0f172a" rx="1" />
                    <rect x="58" y="45" width="6" height="6" fill="#059669" rx="1" />
                    <rect x="68" y="40" width="6" height="6" fill="#0f172a" rx="1" />
                    <rect x="78" y="45" width="6" height="6" fill="#0f172a" rx="1" />
                    <rect x="86" y="42" width="6" height="6" fill="#0f172a" rx="1" />

                    <rect x="38" y="55" width="6" height="6" fill="#0f172a" rx="1" />
                    <rect x="48" y="55" width="6" height="6" fill="#059669" rx="1" />
                    <rect x="58" y="58" width="6" height="6" fill="#0f172a" rx="1" />
                    <rect x="68" y="55" width="6" height="6" fill="#0f172a" rx="1" />
                    <rect x="78" y="58" width="6" height="6" fill="#0f172a" rx="1" />

                    <rect x="38" y="68" width="6" height="6" fill="#059669" rx="1" />
                    <rect x="48" y="72" width="6" height="6" fill="#0f172a" rx="1" />
                    <rect x="58" y="68" width="6" height="6" fill="#0f172a" rx="1" />
                    <rect x="68" y="74" width="6" height="6" fill="#059669" rx="1" />
                    <rect x="78" y="70" width="6" height="6" fill="#0f172a" rx="1" />
                    <rect x="86" y="75" width="6" height="6" fill="#0f172a" rx="1" />

                    <rect x="42" y="84" width="6" height="6" fill="#0f172a" rx="1" />
                    <rect x="52" y="85" width="6" height="6" fill="#059669" rx="1" />
                    <rect x="62" y="84" width="6" height="6" fill="#0f172a" rx="1" />
                    <rect x="74" y="86" width="6" height="6" fill="#0f172a" rx="1" />
                  </svg>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-400">
                    {pass?.qrCodeToken || 'GOLANKA-PASS-138-KM-2026'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyQr}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                  >
                    {copiedQr ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* ONE-CLICK RENEW FOR NEXT MONTH BUTTON (HERO ACTION) */}
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-left space-y-0.5">
                <span className="text-xs font-bold text-slate-300">
                  {currentLang === 'si'
                    ? 'ඩිපෝ පෝලිම් නොමැතිව ක්ෂණිකව අලුත් කරගන්න'
                    : currentLang === 'ta'
                    ? 'வரிசையில் நிற்காமல் 1-கிளிக்கில் புதுப்பிக்கவும்'
                    : 'Skip depot queues with instant online renewal'}
                </span>
                <p className="text-[11px] text-slate-400">
                  Extends validity to July 31, 2026 with verified SLTB clearance.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRenewPass}
                disabled={renewing || loading}
                className="py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                <span className="text-lg">⚡</span>
                <span>
                  {renewing
                    ? 'Renewing Pass...'
                    : (t.renewOneClick || '⚡ 1-Click Renew for Next Month')}
                </span>
              </button>
            </div>
          </div>

          {/* SECTION 2: SAVED FAVORITE ROUTES (1-TAP LIVE TRACKING) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">⭐</span>
                <div>
                  <h3 className="text-xl font-black text-white">
                    {t.savedRoutesTitle || 'Saved Favorite Routes'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    1-Tap instant Live Radar GPS tracking for your daily commute.
                  </p>
                </div>
              </div>
              <Link
                to="/tracker"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline"
              >
                Open Full Radar Map →
              </Link>
            </div>

            {/* Saved Routes List */}
            {user.savedRoutes && user.savedRoutes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.savedRoutes.map((rt) => (
                  <div
                    key={rt.routeNumber}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono font-black text-base flex items-center justify-center border border-emerald-500/30">
                          {rt.routeNumber}
                        </span>
                        <div>
                          <h4 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
                            {rt.routeName || `Route ${rt.routeNumber}`}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            {rt.origin} ⇄ {rt.destination}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeRoute(rt.routeNumber)}
                        className="text-slate-500 hover:text-rose-400 text-xs p-1 transition-colors cursor-pointer"
                        title={t.removeRoute || 'Remove'}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Live Buses Active
                      </span>

                      <Link
                        to={`/tracker?route=${rt.routeNumber}`}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <span>🛰️</span>
                        <span>{t.viewLiveTracking || 'Track Live Now'}</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2">
                <span className="text-3xl block">🚌</span>
                <p className="text-sm font-bold text-slate-300">
                  {t.noSavedRoutesDesc || 'No saved routes yet. Save any corridor for 1-tap tracking.'}
                </p>
                <Link
                  to="/"
                  className="inline-block mt-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 hover:bg-emerald-500/30"
                >
                  Search Corridors to Save →
                </Link>
              </div>
            )}
          </div>

          {/* SECTION 3: RECENT SEAT BOOKINGS & PAYMENT RECEIPTS */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">💺</span>
                <div>
                  <h3 className="text-xl font-black text-white">
                    {t.recentBookingsTitle || 'Recent Seat Bookings & Receipts'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Confirmed expressway tickets, bus seat reservations, and season payments.
                  </p>
                </div>
              </div>
              <Link
                to="/booking"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline"
              >
                + Book New Seats
              </Link>
            </div>

            {/* Bookings List */}
            {user.bookingHistory && user.bookingHistory.length > 0 ? (
              <div className="space-y-3">
                {user.bookingHistory.map((bk, i) => (
                  <div
                    key={bk.bookingId || i}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-2xl flex-shrink-0">
                        {bk.serviceName?.includes('Expressway') ? '⚡' : '🎫'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white">{bk.serviceName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                            {bk.bookingId}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {bk.origin} ➔ {bk.destination} • Date: {bk.travelDate}
                        </p>
                        <p className="text-[11px] text-emerald-400 font-mono mt-0.5">
                          Seats: {Array.isArray(bk.seatNumbers) ? bk.seatNumbers.join(', ') : bk.seatNumbers}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                      <span className="text-base font-black font-mono text-amber-300">
                        Rs. {bk.fareLKR}.00
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        <span>✓</span>
                        <span>{bk.status || 'Confirmed'}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">
                {t.noBookingsDesc || 'No seat reservations recorded yet.'}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
