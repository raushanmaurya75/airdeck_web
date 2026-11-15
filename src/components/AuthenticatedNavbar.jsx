import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Cast, Sun, Moon, LogOut, ShieldAlert } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import UrgentFleetModal from './UrgentFleetModal';
import { getDisplays } from '../services/storageService';

export default function AuthenticatedNavbar() {
  const { toggleTheme, isDark } = useTheme();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isUrgentModalOpen, setIsUrgentModalOpen] = useState(false);

  const displays = getDisplays();
  const displayCount = displays.length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navTabs = [
    { name: 'Displays', path: '/console', count: displayCount },
    { name: 'Media Library', path: '/console/media', count: 3 },
    { name: 'Schedules', path: '/console/schedules', count: 3 },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 h-14 border-b border-hairline bg-surface/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none rounded p-0.5 cursor-pointer"
              title="AirDeck Home"
            >
              <div className="w-6 h-6 rounded bg-[#D4AF37] text-[#0A0A0B] flex items-center justify-center font-bold shadow-none">
                <Cast className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-base tracking-tight text-primary-token font-sans">
                AirDeck
              </span>
            </Link>

            <nav className="flex items-center gap-2">
              {navTabs.map((tab) => {
                const isActive =
                  tab.path === '/console'
                    ? location.pathname === '/console' || location.pathname === '/console/' || location.pathname === '/console/displays'
                    : location.pathname.startsWith(tab.path);

                return (
                  <Link
                    key={tab.name}
                    to={tab.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors font-sans cursor-pointer ${
                      isActive
                        ? 'bg-recessed text-primary-token font-medium border border-hairline'
                        : 'text-secondary-token hover:text-primary-token border border-transparent'
                    }`}
                  >
                    <span>{tab.name}</span>
                    <span className="font-mono text-[11px] opacity-70">
                      {tab.count}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsUrgentModalOpen(true)}
              className="btn-urgent-notice flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium cursor-pointer"
              title="Urgent Fleet Override"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
              <span>Urgent Notice</span>
            </button>

            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-[#D4AF37]" />
              ) : (
                <Moon className="w-4 h-4 text-[#141413]" />
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-secondary-token hover:text-primary-token border border-hairline hover:border-hover bg-surface hover:bg-recessed transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <UrgentFleetModal
        isOpen={isUrgentModalOpen}
        onClose={() => setIsUrgentModalOpen(false)}
      />
    </>
  );
}
