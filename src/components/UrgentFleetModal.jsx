import React, { useState } from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function UrgentFleetModal({ isOpen, onClose }) {
  const { warning } = useToast();
  const [noticeText, setNoticeText] = useState(
    'CAMPUS NOTICE: SCHEDULED SAFETY DRILL IN PROGRESS - PLEASE PROCEED TO DESIGNATED ASSEMBLY POINTS'
  );

  if (!isOpen) return null;

  const handlePushNotice = (e) => {
    e.preventDefault();
    warning(
      'Urgent Override Dispatched',
      'High-priority banner broadcasted across all paired screen endpoints immediately.'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div
        className="relative w-full max-w-md rounded bg-surface border border-hairline p-6 shadow-2xl text-primary-token"
        role="dialog"
        aria-modal="true"
        aria-labelledby="urgent-modal-title"
      >
        <div className="flex items-start justify-between pb-3">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
            <h3 id="urgent-modal-title" className="text-base font-semibold text-red-500 tracking-tight font-sans">
              Urgent Fleet Override
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-secondary-token hover:text-primary-token p-1 rounded hover:bg-recessed transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-secondary-token mb-4 font-sans">
          Broadcasts a high-priority banner across all paired displays immediately.
        </p>

        <form onSubmit={handlePushNotice} className="space-y-4">
          <div>
            <textarea
              rows={4}
              value={noticeText}
              onChange={(e) => setNoticeText(e.target.value.toUpperCase())}
              className="w-full p-3 rounded bg-recessed border border-hairline text-primary-token placeholder-muted-token text-xs font-mono uppercase tracking-wide focus:outline-none focus:border-red-500 transition-colors leading-relaxed resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-xs font-medium border border-hairline bg-surface hover:bg-recessed text-secondary-token hover:text-primary-token transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded text-xs font-medium bg-red-700 hover:bg-red-600 text-white transition-colors cursor-pointer"
            >
              Push Urgent Notice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
