import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import TrackerPage from './pages/TrackerPage.jsx';
import SeasonPage from './pages/SeasonPage.jsx';
import BookingPage from './pages/BookingPage.jsx';
import { translations } from './translations.js';

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
          <Routes>
            <Route path="/" element={<Home t={t} />} />
            <Route path="/tracker" element={<TrackerPage t={t} />} />
            <Route path="/season" element={<SeasonPage t={t} />} />
            <Route path="/booking" element={<BookingPage t={t} />} />
          </Routes>
        </main>
        <Footer t={t} />
      </div>
    </Router>
  );
}

export default App;
