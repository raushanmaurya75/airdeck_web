import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Cast, Sun, Moon, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const { success } = useToast();

  const [email, setEmail] = useState('operator@airdeck.io');
  const [password, setPassword] = useState('••••••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const destination = location.state?.from?.pathname || '/console';

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      login(email, password);
      success('Authentication Verified', 'Authorized operator session active.');
      setIsSubmitting(false);
      navigate(destination, { replace: true });
    }, 200);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-page text-primary-token transition-colors p-4 sm:p-6 font-sans">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-secondary-token hover:text-primary-token transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK</span>
        </Link>

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
      </div>

      <div className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-md rounded bg-surface border border-hairline p-8 shadow-none text-primary-token">
          <Link to="/" className="flex items-center gap-2.5 mb-6 cursor-pointer group" title="AirDeck Home">
            <div className="w-6 h-6 rounded bg-[#D4AF37] text-[#0A0A0B] flex items-center justify-center font-bold shadow-none">
              <Cast className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-base tracking-tight text-primary-token font-sans">
              AirDeck
            </span>
          </Link>

          <h1 className="text-xl font-bold tracking-tight text-primary-token font-sans">
            Console Authentication
          </h1>
          <p className="text-xs text-secondary-token mt-1 mb-6 font-sans">
            Sign in with authorized operator credentials to manage campus displays.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-mono uppercase tracking-[0.16em] text-secondary-token mb-1.5"
              >
                OPERATOR EMAIL
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@airdeck.io"
                className="w-full px-3.5 py-2.5 rounded bg-recessed border border-hairline text-primary-token placeholder-secondary-token text-xs sm:text-sm font-mono focus:outline-none focus:border-[#D4AF37] dark:focus:border-[#D4AF37] light:focus:border-[#141413] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[11px] font-mono uppercase tracking-[0.16em] text-secondary-token mb-1.5"
              >
                ACCESS CREDENTIAL
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded bg-recessed border border-hairline text-primary-token placeholder-secondary-token text-xs sm:text-sm font-mono focus:outline-none focus:border-[#D4AF37] dark:focus:border-[#D4AF37] light:focus:border-[#141413] transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-ref-primary py-2.5 px-4 rounded text-xs sm:text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter Studio Console</span>
                <span className="text-sm">→</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="w-full text-center py-4 text-[11px] font-mono uppercase tracking-[0.16em] text-muted-token">
        AIRDECK STUDIO ACCESS • TLS 1.3 ENCRYPTED
      </div>
    </div>
  );
}
