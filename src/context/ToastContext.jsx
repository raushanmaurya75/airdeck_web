import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'info', duration = 3500 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Helper shortcuts
  const success = useCallback((title, message) => addToast({ title, message, type: 'success' }), [addToast]);
  const info = useCallback((title, message) => addToast({ title, message, type: 'info' }), [addToast]);
  const warning = useCallback((title, message) => addToast({ title, message, type: 'warning' }), [addToast]);
  const error = useCallback((title, message) => addToast({ title, message, type: 'error' }), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, info, warning, error }}>
      {children}
      {/* Toast container */}
      <div
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const typeConfig = {
            success: {
              border: 'border-emerald-500/40',
              bg: 'bg-emerald-950/90 text-emerald-100',
              icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
            },
            warning: {
              border: 'border-amber-500/40',
              bg: 'bg-amber-950/90 text-amber-100',
              icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
            },
            error: {
              border: 'border-rose-500/40',
              bg: 'bg-rose-950/90 text-rose-100',
              icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
            },
            info: {
              border: 'border-indigo-500/40',
              bg: 'bg-slate-900/95 text-slate-100',
              icon: <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />,
            },
          }[toast.type] || {
            border: 'border-slate-700',
            bg: 'bg-slate-900/95 text-slate-100',
            icon: <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />,
          };

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 animate-in slide-in-from-right-4 ${typeConfig.border} ${typeConfig.bg}`}
            >
              {typeConfig.icon}
              <div className="flex-1 min-w-0">
                {toast.title && (
                  <h4 className="font-semibold text-sm leading-tight text-white mb-0.5">
                    {toast.title}
                  </h4>
                )}
                {toast.message && (
                  <p className="text-xs text-slate-300 leading-relaxed break-words">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
