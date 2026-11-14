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
  const [isDeleting, setIsDeleting] = useState(false);

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
      setIsDeleting(true);
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
    <div className="group relative rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-indigo-500/50 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between">
      {/* Top row: Name & Code */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Cast className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white text-base truncate group-hover:text-indigo-200 transition-colors">
                {room.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Created {formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Delete Action */}
          <button
            onClick={handleDelete}
            className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
            title="Delete room"
            aria-label={`Delete ${room.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Room Code Badge */}
        <div className="mt-4 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
              Room Code
            </span>
            <span className="font-mono text-sm font-bold text-indigo-300 tracking-wider">
              {room.code}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            title="Copy room code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Video / Content summary */}
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          {room.video ? (
            <div className="flex items-center gap-1.5 text-indigo-300">
              <Video className="w-3.5 h-3.5 text-indigo-400" />
              <span className="truncate max-w-[200px]">
                {room.video.title || 'Video attached'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-500">
              <Monitor className="w-3.5 h-3.5" />
              <span>Ready for video</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA: Open Room */}
      <div className="mt-5 pt-4 border-t border-slate-800/80">
        <Link
          to={`/room/${room.code}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-slate-800 hover:bg-indigo-600 transition-all duration-200 group-hover:bg-indigo-600 shadow-md group-hover:shadow-indigo-600/25"
        >
          <span>Open Room</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
