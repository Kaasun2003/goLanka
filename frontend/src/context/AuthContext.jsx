import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const API_BASE = 'http://localhost:5000/api/auth';

// Seed demo profiles for instant offline or one-click demo access
export const DEMO_USERS = {
  student: {
    _id: 'user-demo-01',
    fullName: 'Kasun Malinda Bandara',
    phoneNumber: '0773456789',
    email: 'kasun.m@gmail.com',
    nicNumber: '200428901234',
    userType: 'Student',
    avatar: '🎓',
    activeSeasonPassId: 'GL-SC-789012',
    savedRoutes: [
      {
        routeNumber: '138',
        routeName: 'Colombo (Pettah) - Maharagama / Homagama',
        origin: 'Maharagama Clock Tower',
        destination: 'Pettah Central Bus Stand',
        savedAt: new Date().toISOString()
      },
      {
        routeNumber: '100',
        routeName: 'Colombo (Pettah) - Moratuwa / Panadura',
        origin: 'Moratuwa Town',
        destination: 'Pettah Central Bus Stand',
        savedAt: new Date().toISOString()
      }
    ],
    activeSeasonPass: {
      applicationNumber: 'GL-SC-789012',
      passType: 'School / University Student Pass (75% Subsidy)',
      routeNumber: '138',
      travelOrigin: 'Maharagama Clock Tower',
      travelDestination: 'Pettah / Maradana Railway Station',
      validFrom: '2026-05-01',
      validUntil: '2026-06-30',
      fareAmountLKR: 180,
      approvalStatus: 'Approved & Issued',
      qrCodeToken: 'GOLANKA-PASS-138-KM-2026',
      subsidyPercentage: '75%'
    },
    bookingHistory: [
      {
        bookingId: 'BK-EX-8902',
        routeNumber: 'EX-001',
        serviceName: 'Southern Expressway Luxury Superline',
        origin: 'Makumbura Multimodal Center (Kottawa)',
        destination: 'Galle Central Terminal',
        travelDate: '2026-05-10',
        seatNumbers: ['14', '15'],
        fareLKR: 1700,
        status: 'Confirmed',
        bookedAt: new Date().toISOString()
      },
      {
        bookingId: 'BK-SP-1092',
        routeNumber: '138',
        serviceName: 'Digital Season Pass Monthly Subsidy',
        origin: 'Maharagama',
        destination: 'Pettah',
        travelDate: '2026-05-01',
        seatNumbers: ['Digital QR Verified'],
        fareLKR: 180,
        status: 'Active Pass',
        bookedAt: new Date().toISOString()
      }
    ]
  },
  office: {
    _id: 'user-demo-02',
    fullName: 'Dilani Sewwandi Perera',
    phoneNumber: '0712345678',
    email: 'dilani.perera@gov.lk',
    nicNumber: '198971203456',
    userType: 'Office Commuter',
    avatar: '💼',
    activeSeasonPassId: 'GL-OF-456789',
    savedRoutes: [
      {
        routeNumber: '177',
        routeName: 'Kaduwela - Kollupitiya',
        origin: 'Malabe Junction',
        destination: 'Kollupitiya Supermarket',
        savedAt: new Date().toISOString()
      },
      {
        routeNumber: 'EX-001',
        routeName: 'Makumbura - Galle Expressway',
        origin: 'Makumbura',
        destination: 'Galle Central',
        savedAt: new Date().toISOString()
      }
    ],
    activeSeasonPass: {
      applicationNumber: 'GL-OF-456789',
      passType: 'Government / Corporate Transit Pass (50% Subsidy)',
      routeNumber: '177',
      travelOrigin: 'Malabe Junction',
      travelDestination: 'Kollupitiya Supermarket',
      validFrom: '2026-05-01',
      validUntil: '2026-06-30',
      fareAmountLKR: 720,
      approvalStatus: 'Approved & Issued',
      qrCodeToken: 'GOLANKA-PASS-177-DSP-2026',
      subsidyPercentage: '50%'
    },
    bookingHistory: [
      {
        bookingId: 'BK-EX-3401',
        routeNumber: 'EX-002',
        serviceName: 'Central Expressway Luxury Coach',
        origin: 'Makumbura Multimodal Center',
        destination: 'Kandy Goodshed Bus Stand',
        travelDate: '2026-05-12',
        seatNumbers: ['08', '09'],
        fareLKR: 1950,
        status: 'Confirmed',
        bookedAt: new Date().toISOString()
      }
    ]
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('golanka_user');
      return stored ? JSON.parse(stored) : DEMO_USERS.student; // Default pre-authenticated demo user for instant accessibility
    } catch {
      return DEMO_USERS.student;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('golanka_token') || 'GL_DEMO_TOKEN_KASUN';
  });

  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('phone'); // 'phone' | 'email'

  const openAuthModal = (tab = 'phone') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const saveAuthSession = (newUser, newToken) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem('golanka_user', JSON.stringify(newUser));
    localStorage.setItem('golanka_token', newToken);
  };

  // Sync / refresh profile from backend
  const refreshProfile = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          saveAuthSession(data.user, token);
        }
      }
    } catch {
      // Keep local cached user state if offline
    }
  }, [token]);

  // Quick Mobile Login: Step 1 - Send OTP
  const sendOtp = async (phoneNumber) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber })
      });
      const data = await res.json();
      setLoading(false);
      return data;
    } catch {
      setLoading(false);
      // Offline fallback: simulate sending OTP 1955
      return {
        success: true,
        message: 'OTP sent to mobile phone (Simulated: 1955)',
        demoOtp: '1955',
        phoneNumber
      };
    }
  };

  // Quick Mobile Login: Step 2 - Verify OTP & Login
  const verifyOtp = async (phoneNumber, otpCode) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otpCode })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success && data.user) {
        saveAuthSession(data.user, data.token);
        closeAuthModal();
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Verification failed' };
    } catch {
      setLoading(false);
      // Fallback: If OTP is 1955, authenticate as student demo
      if (otpCode === '1955') {
        const fallbackUser = {
          ...DEMO_USERS.student,
          phoneNumber: phoneNumber || DEMO_USERS.student.phoneNumber
        };
        const fallbackToken = 'GL_TOKEN_FALLBACK_' + Date.now();
        saveAuthSession(fallbackUser, fallbackToken);
        closeAuthModal();
        return { success: true, user: fallbackUser };
      }
      return { success: false, message: 'Invalid OTP code. Please use 1955.' };
    }
  };

  // Standard Email & Password Login
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success && data.user) {
        saveAuthSession(data.user, data.token);
        closeAuthModal();
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Invalid email or password' };
    } catch {
      setLoading(false);
      // Fallback
      if (email.toLowerCase().includes('dilani')) {
        saveAuthSession(DEMO_USERS.office, 'GL_TOKEN_OFFICE_DEMO');
        closeAuthModal();
        return { success: true, user: DEMO_USERS.office };
      }
      saveAuthSession(DEMO_USERS.student, 'GL_TOKEN_STUDENT_DEMO');
      closeAuthModal();
      return { success: true, user: DEMO_USERS.student };
    }
  };

  // Standard Registration
  const registerUser = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setLoading(false);

      if (data.success && data.user) {
        saveAuthSession(data.user, data.token);
        closeAuthModal();
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch {
      setLoading(false);
      const newUser = {
        _id: 'user-reg-' + Date.now(),
        fullName: formData.fullName || 'New Commuter',
        phoneNumber: formData.phoneNumber || '0771234567',
        email: formData.email || 'commuter@golanka.lk',
        nicNumber: formData.nicNumber || '200012345678',
        userType: formData.userType || 'General',
        avatar: formData.userType === 'Student' ? '🎓' : formData.userType === 'Office Commuter' ? '💼' : '👤',
        savedRoutes: [],
        activeSeasonPassId: null,
        bookingHistory: []
      };
      const newToken = 'GL_TOKEN_NEW_' + Date.now();
      saveAuthSession(newUser, newToken);
      closeAuthModal();
      return { success: true, user: newUser };
    }
  };

  // Instant 1-Click Login for Demo and Testing
  const loginAsDemo = (type = 'student') => {
    const demoUser = type === 'office' ? DEMO_USERS.office : DEMO_USERS.student;
    const demoToken = type === 'office' ? 'GL_DEMO_TOKEN_DILANI' : 'GL_DEMO_TOKEN_KASUN';
    saveAuthSession(demoUser, demoToken);
    closeAuthModal();
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('golanka_user');
    localStorage.removeItem('golanka_token');
  };

  // One-click Renew Season Pass
  const renewSeasonPass = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/renew-season-pass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setLoading(false);

      if (data.success && data.user) {
        saveAuthSession(data.user, token);
        return { success: true, message: data.message, seasonPass: data.seasonPass };
      }
      throw new Error(data.message || 'Failed to renew');
    } catch {
      setLoading(false);
      // Client-side renewal calculation
      if (user && user.activeSeasonPass) {
        const updatedPass = {
          ...user.activeSeasonPass,
          validUntil: '2026-07-31',
          approvalStatus: 'Approved & Renewed'
        };
        const renewalBooking = {
          bookingId: `BK-RNW-${Date.now().toString().slice(-4)}`,
          routeNumber: updatedPass.routeNumber || '138',
          serviceName: `Digital Season Pass Renewal (July 2026)`,
          origin: updatedPass.travelOrigin,
          destination: updatedPass.travelDestination,
          travelDate: '2026-07-01',
          seatNumbers: ['Digital QR Verified'],
          fareLKR: updatedPass.fareAmountLKR || 180,
          status: 'Active Pass',
          bookedAt: new Date().toISOString()
        };
        const updatedUser = {
          ...user,
          activeSeasonPass: updatedPass,
          bookingHistory: [renewalBooking, ...(user.bookingHistory || [])]
        };
        saveAuthSession(updatedUser, token);
        return {
          success: true,
          message: 'Season pass renewed successfully for next month!',
          seasonPass: updatedPass
        };
      }
      return { success: false, message: 'No active season pass to renew.' };
    }
  };

  // Save / Bookmark Route
  const saveRoute = async (routeData) => {
    if (!user) {
      openAuthModal('phone');
      return { success: false, message: 'Please login to save routes' };
    }

    try {
      const res = await fetch(`${API_BASE}/save-route`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(routeData)
      });
      const data = await res.json();
      if (data.success && data.savedRoutes) {
        const updated = { ...user, savedRoutes: data.savedRoutes };
        saveAuthSession(updated, token);
        return { success: true };
      }
    } catch {
      // Fallback
      const currentRoutes = user.savedRoutes || [];
      const exists = currentRoutes.some(r => r.routeNumber === routeData.routeNumber);
      let updatedRoutes = currentRoutes;
      if (!exists) {
        updatedRoutes = [
          ...currentRoutes,
          {
            routeNumber: routeData.routeNumber,
            routeName: routeData.routeName || `Route ${routeData.routeNumber}`,
            origin: routeData.origin || 'Origin',
            destination: routeData.destination || 'Destination',
            savedAt: new Date().toISOString()
          }
        ];
      }
      const updated = { ...user, savedRoutes: updatedRoutes };
      saveAuthSession(updated, token);
      return { success: true };
    }
  };

  // Remove Route
  const removeRoute = (routeNumber) => {
    if (!user) return;
    const updatedRoutes = (user.savedRoutes || []).filter(r => r.routeNumber !== routeNumber);
    const updated = { ...user, savedRoutes: updatedRoutes };
    saveAuthSession(updated, token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        sendOtp,
        verifyOtp,
        loginWithEmail,
        registerUser,
        loginAsDemo,
        logout,
        refreshProfile,
        renewSeasonPass,
        saveRoute,
        removeRoute
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
