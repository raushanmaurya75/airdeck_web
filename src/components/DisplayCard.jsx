import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Tv,
  ArrowRight,
  Copy,
  Check,
  MapPin,
  Trash2,
  Film,
  Calendar,
  HardDrive
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function DisplayCard({ display, onDelete }) {
  const { success, error: toastError } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(display.pairingCode);
      setCopied(true);
      success('Copied to Clipboard', `Pairing code ${display.pairingCode} copied.`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toastError('Copy failed', 'Please select code manually.');
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Unpair display "${display.name}" (${display.pairingCode})?`)) {
      onDelete(display.id);
    }
  };

  const isOnline = display.status === 'online';

  return (
    <div className="rounded bg-surface border border-hairline hover:border-hover p-5 transition-colors flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded bg-recessed border border-hairline text-primary-token flex items-center justify-center shrink-0 mt-0.5">
              <Tv className="w-4 h-4 text-brand-accent" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-primary-token text-base truncate font-sans">
                {display.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-secondary-token font-mono">
                <MapPin className="w-3 h-3 text-muted-token shrink-0" />
                <span className="truncate">{display.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isOnline ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-[0.16em] bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                ONLINE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-[0.16em] bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                OFFLINE
              </span>
            )}

            <button
              onClick={handleDelete}
              className="text-muted-token hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Unpair Display"
              aria-label={`Unpair ${display.name}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-4 p-2.5 rounded bg-recessed border border-hairline flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono tracking-[0.16em] text-muted-token">
              Hardware Pairing Code
            </span>
            <span className="font-mono text-sm font-bold text-primary-token tracking-[0.22em] tabular-nums">
              {display.pairingCode}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface hover:bg-recessed text-primary-token text-xs font-mono border border-hairline hover:border-hover transition-colors cursor-pointer"
            title="Copy pairing code"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[#10B981]" />
                <span className="text-[#10B981]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-secondary-token" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-3.5 space-y-1.5 text-xs text-secondary-token">
          <div className="flex items-center gap-2 truncate">
            <Film className="w-3.5 h-3.5 text-brand-accent shrink-0" />
            <span className="truncate font-sans text-primary-token">
              {display.activeMedia?.title || 'Continuous Video Showreel'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-secondary-token truncate">
            <Calendar className="w-3.5 h-3.5 text-muted-token shrink-0" />
            <span>Schedule: {display.schedule || '24/7 Continuous Loop'}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-muted-token">
            <HardDrive className="w-3.5 h-3.5 text-muted-token shrink-0" />
            <span>{display.socStorage || '12.4 GB Flash Used'} • {display.resolution || '4K UHD'}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-hairline">
        <Link
          to={`/console/display/${display.id}`}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded text-xs sm:text-sm font-medium btn-ref-primary cursor-pointer"
        >
          <span>Open Studio</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
