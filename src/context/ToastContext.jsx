import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message = '', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((title, message, duration) => addToast('success', title, message, duration), [addToast]);
  const warning = useCallback((title, message, duration) => addToast('warning', title, message, duration), [addToast]);
  const error = useCallback((title, message, duration) => addToast('error', title, message, duration), [addToast]);
  const info = useCallback((title, message, duration) => addToast('info', title, message, duration), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, warning, error, info }}>
      {children}
      <div
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none font-sans"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const typeConfig = {
            success: {
              border: 'border-[#10B981]/40',
              bg: 'bg-surface text-primary-token',
              icon: <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />,
            },
            warning: {
              border: 'border-[#F59E0B]/40',
              bg: 'bg-surface text-primary-token',
              icon: <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />,
            },
            error: {
              border: 'border-rose-500/40',
              bg: 'bg-surface text-primary-token',
              icon: <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />,
            },
            info: {
              border: 'border-hairline',
              bg: 'bg-surface text-primary-token',
              icon: <Info className="w-4 h-4 text-brand-accent shrink-0 mt-0.5" />,
            },
          }[toast.type] || {
            border: 'border-hairline',
            bg: 'bg-surface text-primary-token',
            icon: <Info className="w-4 h-4 text-secondary-token shrink-0 mt-0.5" />,
          };

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded border shadow-xl backdrop-blur-md transition-all duration-200 ${typeConfig.border} ${typeConfig.bg}`}
            >
              {typeConfig.icon}
              <div className="flex-1 min-w-0">
                {toast.title && (
                  <h4 className="font-semibold text-xs leading-tight text-primary-token mb-0.5 font-sans">
                    {toast.title}
                  </h4>
                )}
                {toast.message && (
                  <p className="text-xs text-secondary-token leading-relaxed break-words font-sans">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-secondary-token hover:text-primary-token p-1 rounded transition-colors shrink-0 cursor-pointer"
                aria-label="Dismiss toast"
              >
                <X className="w-3.5 h-3.5" />
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
