
import React, { useState, useEffect } from 'react';
import { Route } from './types';
import Navbar from './components/landing/Navbar';
import HeroSection from './components/landing/HeroSection';
import ProgramsSection from './components/landing/ProgramsSection';
import AboutSection from './components/landing/AboutSection';
import ContactSection from './components/landing/ContactSection';
import Footer from './components/landing/Footer';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleNavigate = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200">
      <Navbar 
        darkMode={darkMode} 
        onToggleDarkMode={toggleDarkMode}
        onNavigate={handleNavigate}
      />
      
      <main>
        <HeroSection onExplore={() => handleNavigate('programs')} />
        <ProgramsSection />
        <AboutSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default App;
