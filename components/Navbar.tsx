
import React from 'react';
import { Route, User, UserRole } from '../types';
import { Menu, X, Sun, Moon, LogIn, LayoutDashboard, User as UserIcon, BookOpen } from 'lucide-react';

interface NavbarProps {
  currentRoute: Route;
  onNavigate: (route: Route) => void;
  user: User | null;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentRoute, 
  onNavigate, 
  user, 
  darkMode, 
  onToggleDarkMode,
  onLogout 
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => onNavigate('home')} 
            className="text-2xl font-bold text-primary italic hover:scale-105 transition-transform"
          >
            EduAgency
          </button>
          
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors ${currentRoute === 'home' ? 'text-primary' : 'hover:text-primary'}`}
            >
              Home
            </button>
            <button 
              onClick={() => onNavigate('courses')}
              className={`text-sm font-medium transition-colors ${currentRoute === 'courses' ? 'text-primary' : 'hover:text-primary'}`}
            >
              Courses
            </button>
            {user?.role === UserRole.ADMIN && (
              <button 
                onClick={() => onNavigate('admin')}
                className={`text-sm font-medium transition-colors ${currentRoute === 'admin' ? 'text-primary' : 'hover:text-primary'}`}
              >
                Dashboard
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={onToggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="hidden md:flex items-center gap-4 ml-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{user.full_name}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="text-sm text-slate-500 hover:text-destructive transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate('auth')}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Get Started
              </button>
            )}
          </div>

          <button 
            className="md:hidden p-2 ml-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
          <button onClick={() => { onNavigate('home'); setIsMenuOpen(false); }} className="text-left py-2 font-medium">Home</button>
          <button onClick={() => { onNavigate('courses'); setIsMenuOpen(false); }} className="text-left py-2 font-medium">Courses</button>
          {user?.role === UserRole.ADMIN && (
            <button onClick={() => { onNavigate('admin'); setIsMenuOpen(false); }} className="text-left py-2 font-medium">Dashboard</button>
          )}
          {!user ? (
            <button onClick={() => { onNavigate('auth'); setIsMenuOpen(false); }} className="bg-primary text-white p-3 rounded-lg text-center font-medium">Login / Sign Up</button>
          ) : (
            <button onClick={() => { onLogout(); setIsMenuOpen(false); }} className="text-destructive font-medium py-2">Logout</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
