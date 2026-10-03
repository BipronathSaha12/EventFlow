import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { Calendar, Ticket, QrCode, Bell, Sun, Moon, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount, isOpen: isNotifOpen, setIsOpen: setIsNotifOpen } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) => `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
    isActive(path) 
      ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white' 
      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-white'
  }`;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Ticket className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-xl text-slate-900 dark:text-white">EventFlow</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1">
            <Link to="/" className={linkClass('/')}>Explore Events</Link>
            <Link to="/calendar" className={linkClass('/calendar')}>Calendar</Link>
            <Link to="/verify" className={linkClass('/verify')}>Verify Ticket</Link>
            {user && <Link to="/dashboard" className={linkClass('/dashboard')}>My Dashboard</Link>}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-md dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-md dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <div className="hidden md:flex items-center gap-3 ml-2 pl-4 border-l border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {user.first_name || user.username}
                  </span>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-md dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2 ml-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Sign In</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors">Get Started</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`block ${linkClass('/')}`}>Explore Events</Link>
            <Link to="/calendar" onClick={() => setMobileMenuOpen(false)} className={`block ${linkClass('/calendar')}`}>Calendar</Link>
            <Link to="/verify" onClick={() => setMobileMenuOpen(false)} className={`block ${linkClass('/verify')}`}>Verify Ticket</Link>
            {user && <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={`block ${linkClass('/dashboard')}`}>My Dashboard</Link>}
            
            {!user ? (
              <div className="pt-4 pb-2 border-t border-slate-200 dark:border-slate-700">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-300">Sign In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 mt-1 text-base font-medium text-indigo-600 dark:text-indigo-400">Create Account</Link>
              </div>
            ) : (
              <div className="pt-4 pb-2 border-t border-slate-200 dark:border-slate-700">
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 dark:text-red-400">Sign Out</button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
