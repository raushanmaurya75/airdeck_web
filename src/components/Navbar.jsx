import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Cast, Plus, Sun, Moon, LayoutGrid, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenCreateModal }) {
  const { toggleTheme, isDark } = useTheme();
  const { logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isConsole = location.pathname === '/console';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b border-hairline bg-surface/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] rounded p-1 cursor-pointer"
            title="AirDeck Home"
          >
            <div className="w-9 h-9 rounded bg-[#D4AF37] text-[#0A0A0B] flex items-center justify-center font-bold transition-transform group-hover:scale-[1.02] shadow-none">
              <Cast className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base sm:text-lg tracking-tight text-primary-token font-sans">
                  AirDeck
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.16em] px-1.5 py-0.5 rounded bg-recessed border border-hairline text-secondary-token">
                  Console v1.0
                </span>
              </div>
              <p className="text-[11px] text-secondary-token font-mono tracking-tight leading-none hidden sm:block">
                Synchronized Broadcast Architecture
              </p>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/console"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
              isConsole
                ? 'bg-recessed text-primary-token border border-hairline'
                : 'text-secondary-token hover:text-primary-token hover:bg-recessed border border-transparent'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Console</span>
          </Link>

          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-secondary-token px-3 py-1.5 rounded bg-recessed border border-hairline">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span className="text-secondary-token">Signal:</span>
            <span className="text-[#10B981] font-medium">Ready</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
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

          {onOpenCreateModal && (
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded btn-ref-primary focus:outline-none cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Room</span>
              <span className="sm:hidden">Create</span>
            </button>
          )}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="p-2 rounded text-secondary-token hover:text-primary-token border border-hairline hover:border-hover bg-surface hover:bg-recessed transition-colors cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
