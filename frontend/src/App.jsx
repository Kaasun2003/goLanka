import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import TrackerPage from './pages/TrackerPage.jsx';
import SeasonPage from './pages/SeasonPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import { translations } from './translations.js';

// Animated Route Wrapper that animates the target page/section every time a navigation occurs
const AnimatedContent = ({ t, currentLang }) => {
  const location = useLocation();

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
          }, 2000);
        }, 150);
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
      </Routes>
    </div>
  );
};

function App() {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('golanka_lang') || 'si';
  });

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('golanka_lang', lang);
  };

  const t = translations[currentLang] || translations.en;

  useEffect(() => {
    document.title = `${t.brandName || 'goLanka'} | ${t.heroTitle || 'Sri Lanka Bus Transit'}`;
  }, [t]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-400 selection:text-slate-950 font-sans transition-colors duration-300">
        <Navbar currentLang={currentLang} setLanguage={handleLanguageChange} t={t} />
        <main className="flex-grow">
          <AnimatedContent t={t} currentLang={currentLang} />
        </main>
        <Footer t={t} currentLang={currentLang} />
      </div>
    </Router>
  );
}

export default App;
