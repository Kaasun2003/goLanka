import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TrackerPage from './pages/TrackerPage';
import SeasonPage from './pages/SeasonPage';
import { translations } from './translations';

function App() {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('golanka_lang') || 'en';
  });

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('golanka_lang', lang);
  };

  const t = translations[currentLang] || translations.en;

  useEffect(() => {
    document.title = `${t.brandName} | ${t.heroTitle}`;
  }, [t]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-400 selection:text-slate-950 font-sans">
        <Navbar currentLang={currentLang} setLanguage={handleLanguageChange} t={t} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home t={t} />} />
            <Route path="/tracker" element={<TrackerPage t={t} />} />
            <Route path="/season" element={<SeasonPage t={t} />} />
          </Routes>
        </main>
        <Footer t={t} />
      </div>
    </Router>
  );
}

export default App;
