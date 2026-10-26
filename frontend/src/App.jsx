import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AuthModal from './components/AuthModal.jsx';
import MobileBottomNav from './components/MobileBottomNav.jsx';
import QrBottomSheet from './components/QrBottomSheet.jsx';
import Home from './pages/Home.jsx';
import TrackerPage from './pages/TrackerPage.jsx';
import SeasonPage from './pages/SeasonPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { translations } from './translations.js';

// Animated Route Wrapper that animates the target page/section every time a navigation occurs
const AnimatedContent = ({ t, currentLang }) => {
  const location = useLocation();
  const { openAuthModal } = useAuth();

  // If user navigates directly to /login, automatically trigger auth modal
  useEffect(() => {
    if (location.pathname === '/login') {
      openAuthModal('phone');
    }
  }, [location.pathname, openAuthModal]);

  // Scroll-triggered Reveal Observer: slowly loads sections and categories as user scrolls down the page
  useEffect(() => {
    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    const observeTargets = () => {
      const targets = document.querySelectorAll('.scroll-reveal:not(.revealed), .scroll-reveal-scale:not(.revealed)');
      targets.forEach((el) => observer.observe(el));
    };

    observeTargets();

    // Re-check on dynamic updates (e.g. search results or tabs)
    const mutationObserver = new MutationObserver(() => {
      observeTargets();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  useEffect(() => {
    // If a hash exists (e.g. #booking), smoothly scroll and highlight that section with animation
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          element.classList.remove('section-highlight-active');
          void element.offsetWidth; // trigger reflow
          element.classList.add('section-highlight-active');
          setTimeout(() => {
            element.classList.remove('section-highlight-active');
          }, 2400);
        }, 180);
      }
    } else {
      // Smoothly scroll to top on page navigation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);

  return (
    <div key={location.pathname} className="animate-page-enter">
      <Routes location={location}>
        <Route path="/" element={<Home t={t} currentLang={currentLang} />} />
        <Route path="/tracker" element={<TrackerPage t={t} currentLang={currentLang} />} />
        <Route path="/season" element={<SeasonPage t={t} currentLang={currentLang} />} />
        <Route path="/booking" element={<BookingPage t={t} currentLang={currentLang} />} />
        <Route path="/profile" element={<ProfilePage t={t} currentLang={currentLang} />} />
        <Route path="/login" element={<ProfilePage t={t} currentLang={currentLang} />} />
      </Routes>
    </div>
  );
};

function App() {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('golanka_lang') || 'si';
  });
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('golanka_lang', lang);
  };

  const t = translations[currentLang] || translations.en;

  useEffect(() => {
    document.title = `${t.brandName || 'goLanka'} | ${t.heroTitle || 'Sri Lanka Bus Transit'}`;
  }, [t]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="relative flex flex-col min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-slate-950 text-slate-100 selection:bg-emerald-400 selection:text-slate-950 font-sans transition-colors duration-300">
            {/* Top Ambient Glow behind Liquid Glass Navbar */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-36 bg-gradient-to-b from-emerald-500/20 via-teal-500/10 to-transparent blur-3xl pointer-events-none z-0"></div>
            <Navbar 
              currentLang={currentLang} 
              setLanguage={handleLanguageChange} 
              t={t}
              onOpenQr={() => setQrModalOpen(true)}
            />
            <main className="flex-grow w-full max-w-[100vw] overflow-x-hidden pb-24 md:pb-0 relative z-10">
              <AnimatedContent t={t} currentLang={currentLang} />
            </main>
            <Footer t={t} currentLang={currentLang} />
            
            {/* Native Mobile Sticky Bottom Navigation (< md) */}
            <MobileBottomNav 
              onOpenQr={() => setQrModalOpen(true)}
              currentLang={currentLang}
              t={t}
            />

            {/* Slide-Up Bottom Sheet QR Modal */}
            <QrBottomSheet 
              isOpen={qrModalOpen}
              onClose={() => setQrModalOpen(false)}
              t={t}
              currentLang={currentLang}
            />

            <AuthModal t={t} currentLang={currentLang} />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

