import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Copy, Check, Sparkles, RefreshCw, Cast, ArrowRight } from 'lucide-react';
import { generateRoomCode, saveRoom } from '../services/storageService';
import { useToast } from '../context/ToastContext';

export default function CreateRoomModal({ isOpen, onClose, onRoomCreated }) {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize or re-generate code when modal opens
  useEffect(() => {
    if (isOpen) {
      setRoomCode(generateRoomCode());
      setRoomName('');
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRegenerateCode = () => {
    setRoomCode(generateRoomCode());
    setCopied(false);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      success('Copied!', `Room code ${roomCode} copied to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toastError('Copy failed', 'Please manually copy the room code');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = roomName.trim();
    if (!trimmedName) {
      toastError('Name required', 'Please enter a name for your room');
      return;
    }

    setIsSubmitting(true);

    try {
      const newRoom = {
        code: roomCode,
        name: trimmedName,
        createdAt: new Date().toISOString(),
        video: null,
        contentType: 'video', // Extensible for slides, docs
      };

      // Persist in localStorage via storageService
      // TODO: replace with real backend/socket logic (POST /api/rooms)
      saveRoom(newRoom);

      success('Room created!', `Room "${trimmedName}" (${roomCode}) is ready.`);

      if (onRoomCreated) {
        onRoomCreated(newRoom);
      }

      onClose();
      // Redirect to Active Room page
      navigate(`/room/${roomCode}`);
    } catch (err) {
      console.error(err);
      toastError('Error', 'Failed to create room. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-7 overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Glow backdrop decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Cast className="w-5 h-5" />
            </div>
            <div>
              <h3 id="modal-headline" className="text-lg font-bold text-white tracking-tight">
                Create New Cast Room
              </h3>
              <p className="text-xs text-slate-400">
                Setup a synchronized space for screens and devices
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Room Name Input */}
          <div>
            <label htmlFor="room-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Room Name
            </label>
            <input
              id="room-name"
              type="text"
              autoFocus
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. Design Sync, Studio Keynote, Theater Room"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
              maxLength={60}
            />
            <p className="mt-1.5 text-xs text-slate-400">
              Choose a friendly name that participants will recognize.
            </p>
          </div>

          {/* Generated Room Code Display */}
          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Auto-Generated Shareable Code
              </span>
              <button
                type="button"
                onClick={handleRegenerateCode}
                className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                title="Generate another code"
              >
                <RefreshCw className="w-3 h-3" />
                Regenerate
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 bg-slate-900/90 rounded-lg p-2.5 border border-slate-800">
              <span className="font-mono text-xl sm:text-2xl font-black tracking-widest text-indigo-300 select-all">
                {roomCode}
              </span>

              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              Share this code with devices or team members to join this session.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !roomName.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Save & Open Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
