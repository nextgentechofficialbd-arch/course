
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import Navbar from './components/landing/Navbar';
import HeroSection from './components/landing/HeroSection';
import ProgramsSection from './components/landing/ProgramsSection';
import AboutSection from './components/landing/AboutSection';
import ContactSection from './components/landing/ContactSection';
import Footer from './components/landing/Footer';
import Courses from './components/Courses';
import Auth from './components/Auth';
import { usePathname } from 'next/navigation';

const App: React.FC = () => {
  const pathname = usePathname();

  const handleNavigate = (sectionId: string) => {
    if (pathname !== '/') {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new Event('popstate'));
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderPage = () => {
    if (pathname === '/auth') {
      return (
        <div className="pt-20 min-h-screen">
          <Auth onAuthSuccess={() => {
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new Event('popstate'));
          }} />
        </div>
      );
    }
    
    if (pathname === '/programs') {
      return (
        <div className="pt-24 min-h-screen">
          <Courses onNavigate={(route) => {
            if (route === 'home') {
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new Event('popstate'));
            }
          }} />
        </div>
      );
    }

    // Default landing page
    return (
      <>
        <HeroSection onExplore={() => handleNavigate('programs')} />
        <ProgramsSection />
        <AboutSection />
        <ContactSection />
      </>
    );
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Navbar />
        <main>
          {renderPage()}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;