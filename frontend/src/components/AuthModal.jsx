import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const AuthModal = ({ t, currentLang = 'si' }) => {
  const {
    authModalOpen,
    authModalTab,
    closeAuthModal,
    sendOtp,
    verifyOtp,
    loginWithEmail,
    registerUser,
    loginAsDemo,
    loading
  } = useAuth();

  const [activeTab, setActiveTab] = useState(authModalTab || 'phone');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Phone OTP State
  const [phoneNumber, setPhoneNumber] = useState('0773456789');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['1', '9', '5', '5']);
  const [simulatedCode, setSimulatedCode] = useState('1955');
  const [phoneMessage, setPhoneMessage] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Email / Password State
  const [email, setEmail] = useState('kasun.m@gmail.com');
  const [password, setPassword] = useState('golanka123');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [nicNumber, setNicNumber] = useState('');
  const [userType, setUserType] = useState('Student');
  const [emailError, setEmailError] = useState('');

  const otpInputsRef = useRef([]);

  // Sync activeTab when modal opens with specified tab
  useEffect(() => {
    if (authModalTab) {
      setActiveTab(authModalTab);
    }
  }, [authModalTab]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && authModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  // Handle OTP digit changes
  const handleOtpChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // Auto-focus next box
    if (cleanVal && index < 3 && otpInputsRef.current[index + 1]) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Quick auto-fill simulated OTP
  const autoFillOtp = () => {
    setOtpDigits(['1', '9', '5', '5']);
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setPhoneError('');
    setPhoneMessage('');

    if (!phoneNumber || phoneNumber.trim().length < 9) {
      setPhoneError('කරුණාකර නිවැරදි ජංගම දුරකථන අංකයක් ඇතුළත් කරන්න (Please enter a valid phone number)');
      return;
    }

    const res = await sendOtp(phoneNumber);
    if (res.success) {
      setOtpSent(true);
      setSimulatedCode(res.demoOtp || '1955');
      setPhoneMessage(`SMS කේතය සාර්ථකව යවන ලදී (Demo OTP: ${res.demoOtp || '1955'})`);
      setTimeout(() => otpInputsRef.current[0]?.focus(), 150);
    } else {
      setPhoneError(res.message || 'OTP කේතය යැවීමට නොහැකි විය.');
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setPhoneError('');

    const fullCode = otpDigits.join('');
    if (fullCode.length !== 4) {
      setPhoneError('කරුණාකර ඉලක්කම් 4ක සම්පූර්ණ OTP කේතය ඇතුළත් කරන්න.');
      return;
    }

    const res = await verifyOtp(phoneNumber, fullCode);
    if (!res.success) {
      setPhoneError(res.message || 'වැරදි OTP කේතයකි. කරුණාකර 1955 භාවිතා කරන්න.');
    }
  };

  // Email Submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');

    if (isRegisterMode) {
      if (!fullName || !email || !password) {
        setEmailError('කරුණාකර අවශ්‍ය සියලු තොරතුරු ඇතුළත් කරන්න (Please fill all required fields)');
        return;
      }
      const res = await registerUser({
        fullName,
        email,
        password,
        phoneNumber,
        nicNumber,
        userType
      });
      if (!res.success) {
        setEmailError(res.message || 'ලියාපදිංචිය අසාර්ථක විය.');
      }
    } else {
      if (!email || !password) {
        setEmailError('කරුණාකර ඊමේල් ලිපිනය සහ මුරපදය ඇතුළත් කරන්න.');
        return;
      }
      const res = await loginWithEmail(email, password);
      if (!res.success) {
        setEmailError(res.message || 'පිවිසීම අසාර්ථක විය.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-slate-900 border-2 border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden animate-scale-in text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Glow Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500"></div>

        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 w-10 h-10 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-lg font-black transition-all cursor-pointer border border-slate-700 active:scale-90"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Brand & Title */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <span>🇱🇰 goLanka Account</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isRegisterMode ? (t.signUpBtn || 'Create Account') : (t.login || 'Login to goLanka')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {currentLang === 'si'
                ? 'ශ්‍රී ලංකා බස් සේවා, ඩිජිටල් සීසන් පාස් සහ සජීවී GPS මධ්‍යස්ථානය'
                : currentLang === 'ta'
                ? 'இலங்கை பேருந்து சேவை & நேரலை ஜிபிஎஸ் மையம்'
                : 'Sri Lanka Bus Transit, Digital Season Passes & Live GPS Hub'}
            </p>
          </div>

          {/* Easy Switcher Tabs (Large & Highly Legible for 15-50 Age Group) */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950/90 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setActiveTab('phone');
                setIsRegisterMode(false);
              }}
              className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'phone'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="text-base sm:text-lg">📱</span>
              <span className="truncate">{t.quickPhoneLogin || 'Quick Phone OTP'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('email')}
              className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'email'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="text-base sm:text-lg">✉️</span>
              <span className="truncate">{t.emailPasswordLogin || 'Email & Password'}</span>
            </button>
          </div>

          {/* TAB 1: QUICK MOBILE LOGIN (PHONE + 4-DIGIT OTP) */}
          {activeTab === 'phone' && (
            <div className="space-y-5 animate-fade-in">
              
              {/* Phone Input */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-bold text-slate-300">
                  {t.phoneNumber || 'Mobile Phone Number'}
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center gap-1.5 text-slate-400 font-bold text-sm pointer-events-none border-r border-slate-700 pr-2.5">
                    <span>🇱🇰</span>
                    <span className="text-emerald-400">+94</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="077 345 6789"
                    className="w-full pl-24 pr-4 py-3.5 bg-slate-950 border-2 border-slate-700/80 rounded-2xl text-white font-mono font-bold text-base focus:border-emerald-400 focus:outline-none transition-all placeholder:text-slate-600"
                    disabled={otpSent}
                  />
                  {otpSent && (
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="absolute right-3 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                    >
                      Change
                    </button>
                  )}
                </div>
              </div>

              {/* Step 1: Send OTP button */}
              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <span>📲</span>
                  <span>{loading ? 'Sending Code...' : (t.getOtp || 'Send 4-Digit Code (SMS)')}</span>
                </button>
              ) : (
                /* Step 2: 4-Digit OTP Input & Verification */
                <div className="space-y-4 pt-1 animate-scale-in">
                  
                  {/* Demo OTP Helper Box with 1-Tap Auto-fill */}
                  <div className="p-3.5 bg-emerald-950/40 border-2 border-emerald-500/30 rounded-2xl flex items-center justify-between gap-2">
                    <div className="text-left space-y-0.5">
                      <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-xs">
                        <span>⚡</span>
                        <span>{t.demoOtpHint || 'Demo OTP Code: 1955'}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {currentLang === 'si' ? 'SLTB හදිසි ඇමතුම් අංකය (1955) කේතය ලෙස භාවිතා වේ.' : 'SLTB Transit 24/7 Hotline (1955) is the demo code.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={autoFillOtp}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-black transition-all cursor-pointer whitespace-nowrap active:scale-90"
                    >
                      ⚡ Auto-fill
                    </button>
                  </div>

                  {/* 4 Distinct Large OTP Boxes for Older and Younger Users */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-300 text-left">
                      {t.enterOtp || 'Enter 4-Digit OTP Code'}
                    </label>
                    <div className="flex items-center justify-center gap-3 sm:gap-4">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpInputsRef.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className="w-14 h-16 sm:w-16 sm:h-18 text-center bg-slate-950 border-2 border-slate-700 rounded-2xl text-2xl sm:text-3xl font-mono font-black text-emerald-400 focus:border-emerald-400 focus:bg-slate-900 focus:outline-none transition-all shadow-inner"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Verify & Login Button */}
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <span>🔓</span>
                    <span>{loading ? 'Verifying...' : (t.verifyAndLogin || 'Verify & Access Account')}</span>
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      කේතය නැවත එවන්න (Resend OTP SMS)
                    </button>
                  </div>
                </div>
              )}

              {/* Status & Error Messages */}
              {phoneMessage && (
                <p className="text-xs font-bold text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-center">
                  ✅ {phoneMessage}
                </p>
              )}
              {phoneError && (
                <p className="text-xs font-bold text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 text-center">
                  ⚠️ {phoneError}
                </p>
              )}
            </div>
          )}

          {/* TAB 2: EMAIL & PASSWORD / SIGN UP */}
          {activeTab === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4 animate-fade-in text-left">
              
              {/* Registration Extra Fields */}
              {isRegisterMode && (
                <>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300">
                      {t.fullName || 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Kasun Bandara"
                      className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-700/80 rounded-2xl text-white font-medium text-sm focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">
                        {t.nicNumber || 'NIC / Student ID'}
                      </label>
                      <input
                        type="text"
                        value={nicNumber}
                        onChange={(e) => setNicNumber(e.target.value)}
                        placeholder="200428901234"
                        className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-700/80 rounded-2xl text-white font-medium text-sm focus:border-emerald-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">
                        {t.userType || 'Commuter Category'}
                      </label>
                      <select
                        value={userType}
                        onChange={(e) => setUserType(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border-2 border-slate-700/80 rounded-2xl text-white font-bold text-sm focus:border-emerald-400 focus:outline-none cursor-pointer"
                      >
                        <option value="Student">🎓 {t.studentType || 'Student (75% Subsidy)'}</option>
                        <option value="Office Commuter">💼 {t.officeType || 'Office Commuter'}</option>
                        <option value="General">👤 {t.generalType || 'General Commuter'}</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">
                  {t.email || 'Email Address'} *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="commuter@golanka.lk"
                  className="w-full px-4 py-3.5 bg-slate-950 border-2 border-slate-700/80 rounded-2xl text-white font-medium text-sm focus:border-emerald-400 focus:outline-none"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">
                  {t.password || 'Password'} *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 bg-slate-950 border-2 border-slate-700/80 rounded-2xl text-white font-medium text-sm focus:border-emerald-400 focus:outline-none pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm cursor-pointer p-1"
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {emailError && (
                <p className="text-xs font-bold text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 text-center">
                  ⚠️ {emailError}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <span>{isRegisterMode ? '✨' : '🚀'}</span>
                <span>
                  {loading
                    ? 'Processing...'
                    : isRegisterMode
                    ? (t.signUpBtn || 'Create Account')
                    : (t.loginBtn || 'Login')}
                </span>
              </button>

              {/* Continue with Google */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-3 text-slate-500 font-bold">OR</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => loginAsDemo('student')}
                className="w-full py-3 px-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border-2 border-slate-700 hover:border-slate-600 text-white font-bold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer active:scale-95 shadow-sm"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{t.continueWithGoogle || 'Continue with Google'}</span>
              </button>

              {/* Toggle Register / Login */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode);
                    setEmailError('');
                  }}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                >
                  {isRegisterMode
                    ? 'දැනටමත් ගිණුමක් තිබේද? පිවිසෙන්න (Already have an account? Login)'
                    : 'නව මගී ගිණුමක් අවශ්‍යද? ලියාපදිංචි වන්න (New user? Sign Up)'}
                </button>
              </div>
            </form>
          )}

          {/* 1-Click Demo Profiles Footer (Ideal for Instant Testing & Evaluation) */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                ⚡ 1-Click Demo Commuter Login:
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Instant Access</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => loginAsDemo('student')}
                className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800/90 border border-slate-700/80 hover:border-emerald-500/50 text-left transition-all cursor-pointer group active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎓</span>
                  <div className="truncate">
                    <p className="text-xs font-black text-white group-hover:text-emerald-300">
                      Kasun (Student)
                    </p>
                    <p className="text-[10px] text-slate-400">75% Subsidy Pass</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => loginAsDemo('office')}
                className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800/90 border border-slate-700/80 hover:border-emerald-500/50 text-left transition-all cursor-pointer group active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">💼</span>
                  <div className="truncate">
                    <p className="text-xs font-black text-white group-hover:text-emerald-300">
                      Dilani (Office)
                    </p>
                    <p className="text-[10px] text-slate-400">Route 177 Pass</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthModal;
