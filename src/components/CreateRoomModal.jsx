import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Copy, Check, RefreshCw, Cast, ArrowRight } from 'lucide-react';
import { generateRoomCode, saveRoom } from '../services/storageService';
import { useToast } from '../context/ToastContext';

export default function CreateRoomModal({ isOpen, onClose, onRoomCreated }) {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        contentType: 'video',
      };

      saveRoom(newRoom);
      success('Room created!', `Room "${trimmedName}" (${roomCode}) is ready.`);

      if (onRoomCreated) {
        onRoomCreated(newRoom);
      }

      onClose();
      navigate(`/room/${roomCode}`);
    } catch (err) {
      console.error(err);
      toastError('Error', 'Failed to create room. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div
        className="relative w-full max-w-md rounded bg-surface border border-hairline p-6 shadow-2xl text-primary-token"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div className="flex items-center justify-between pb-4 border-b border-hairline">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#D4AF37] text-[#0A0A0B] flex items-center justify-center font-bold shadow-none">
              <Cast className="w-4 h-4" />
            </div>
            <div>
              <h3 id="modal-headline" className="text-base font-semibold text-primary-token tracking-tight font-sans">
                Initialize Cast Room
              </h3>
              <p className="text-xs text-secondary-token">
                Configure a hardware-addressed broadcast channel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-secondary-token hover:text-primary-token p-1 rounded hover:bg-recessed transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="room-name" className="block text-[11px] font-mono uppercase tracking-[0.16em] text-secondary-token mb-1.5">
              Room Identifier / Label
            </label>
            <input
              id="room-name"
              type="text"
              autoFocus
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. Design Studio Screen, Main Auditorium 4K"
              className="w-full px-3 py-2 rounded bg-recessed border border-hairline text-primary-token placeholder-muted-token focus:outline-none focus:border-[#D4AF37] dark:focus:border-[#D4AF37] light:focus:border-[#141413] text-xs sm:text-sm transition-colors"
              maxLength={60}
            />
          </div>

          <div className="rounded bg-recessed border border-hairline p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-secondary-token">
                Hardware Address Code
              </span>
              <button
                type="button"
                onClick={handleRegenerateCode}
                className="text-[11px] font-mono text-secondary-token hover:text-primary-token flex items-center gap-1 transition-colors cursor-pointer"
                title="Regenerate code"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Regenerate</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 bg-surface rounded p-2.5 border border-hairline">
              <span className="font-mono text-lg sm:text-xl font-bold tracking-[0.22em] text-primary-token select-all tabular-nums">
                {roomCode}
              </span>

              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-recessed hover:bg-surface text-secondary-token hover:text-primary-token text-xs font-mono border border-hairline hover:border-hover transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-[#10B981]" />
                    <span className="text-[#10B981]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-hairline">
            <button
              type="button"
              onClick={onClose}
              className="btn-ref-secondary px-4 py-2 rounded text-xs sm:text-sm font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !roomName.trim()}
              className="btn-ref-primary flex items-center gap-2 px-4 py-2 rounded text-xs sm:text-sm font-medium disabled:opacity-50 cursor-pointer"
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
