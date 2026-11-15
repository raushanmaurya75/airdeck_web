import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cast,
  ArrowRight,
  Copy,
  Check,
  Calendar,
  Trash2,
  Video,
  Monitor
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function RoomCard({ room, onDelete }) {
  const { success, error } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      success('Copied!', `Room code ${room.code} copied`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      error('Copy failed', 'Please select and copy manually');
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete room "${room.name}" (${room.code})?`)) {
      onDelete(room.code);
    }
  };

  const formattedDate = room.createdAt
    ? new Date(room.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <div className="group rounded bg-surface border border-hairline hover:border-hover p-5 transition-colors flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded bg-[#D4AF37] text-[#0A0A0B] flex items-center justify-center shrink-0 font-bold shadow-none">
              <Cast className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-primary-token text-sm sm:text-base truncate font-sans">
                {room.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-secondary-token">
                <Calendar className="w-3.5 h-3.5 text-muted-token" />
                <span>Created {formattedDate}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="text-muted-token hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Delete room"
            aria-label={`Delete ${room.name}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 p-2.5 rounded bg-recessed border border-hairline flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono tracking-[0.16em] text-muted-token">
              Room Code
            </span>
            <span className="font-mono text-sm font-semibold text-primary-token tracking-[0.22em] tabular-nums">
              {room.code}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface hover:bg-recessed text-primary-token text-xs font-mono border border-hairline hover:border-hover transition-colors cursor-pointer"
            title="Copy room code"
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

        <div className="mt-3 flex items-center gap-2 text-xs text-secondary-token">
          {room.video ? (
            <div className="flex items-center gap-1.5 text-primary-token">
              <Video className="w-3.5 h-3.5 text-brand-accent" />
              <span className="truncate max-w-[200px]">
                {room.video.title || 'Video attached'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-muted-token font-mono text-[11px]">
              <Monitor className="w-3.5 h-3.5" />
              <span>Awaiting video source</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-hairline">
        <Link
          to={`/room/${room.code}`}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded text-xs sm:text-sm font-medium btn-ref-primary cursor-pointer"
        >
          <span>Open Room</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
