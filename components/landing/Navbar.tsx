
import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, LogIn } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigate: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, onToggleDarkMode, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Programs', id: 'programs' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div 
          onClick={() => onNavigate('home')} 
          className="cursor-pointer group flex items-center gap-2"
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl italic group-hover:rotate-12 transition-transform">
            E
          </div>
          <span className="text-2xl font-black tracking-tighter dark:text-white">EduAgency</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
            >
              {link.name}
            </button>
          ))}
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

          <button 
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
            Login
            <LogIn className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={onToggleDarkMode} className="p-2">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[70px] bg-white dark:bg-slate-950 z-40 p-6 flex flex-col gap-6 animate-in slide-in-from-right duration-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => { onNavigate(link.id); setIsMenuOpen(false); }}
              className="text-2xl font-black text-left border-b border-slate-100 dark:border-slate-800 pb-4"
            >
              {link.name}
            </button>
          ))}
          <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg mt-4">
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
