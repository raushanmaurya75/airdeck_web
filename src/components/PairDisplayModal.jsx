import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { saveDisplay, generatePairingCode } from '../services/storageService';
import { useToast } from '../context/ToastContext';

export default function PairDisplayModal({ isOpen, onClose, onDisplayPaired }) {
  const { success, error: toastError } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [location, setLocation] = useState('');
  const [pairingCode, setPairingCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPairingCode(generatePairingCode());
      setDisplayName('');
      setLocation('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerateNew = () => {
    setPairingCode(generatePairingCode());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = displayName.trim();
    const trimmedLoc = location.trim();
    const cleanCode = pairingCode.trim().toUpperCase();

    if (!trimmedName) {
      toastError('Name required', 'Please enter a location name for this display.');
      return;
    }

    if (!cleanCode) {
      toastError('Code required', 'Please enter the 6-character pairing code.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newDisplay = {
        name: trimmedName,
        location: trimmedLoc || 'Ground Atrium • 4K Panel',
        pairingCode: cleanCode,
        status: 'online',
        activeMedia: {
          title: 'Convocation Keynote Reel',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          type: 'direct',
        },
        schedule: 'Loop: Convocation Keynote Reel (Mon – Sat)',
        overlayText: 'CAMPUS NOTICE: AIRDECK BROADCAST NODE ACTIVE',
      };

      const saved = saveDisplay(newDisplay);
      success('Display Paired', `Screen "${trimmedName}" (${saved.pairingCode}) bound successfully.`);

      if (onDisplayPaired) {
        onDisplayPaired(saved);
      }

      onClose();
    } catch (err) {
      console.error(err);
      toastError('Pairing Error', 'Failed to bind display endpoint.');
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
        aria-labelledby="pair-modal-headline"
      >
        <div className="flex items-start justify-between pb-1">
          <div>
            <h3 id="pair-modal-headline" className="text-base font-semibold text-primary-token tracking-tight font-sans">
              Pair Commercial Display
            </h3>
            <p className="text-xs text-secondary-token mt-1">
              Enter a location label and the 6-character code displayed on the TV endpoint.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-secondary-token hover:text-primary-token p-1 rounded hover:bg-recessed transition-colors ml-2 cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="display-name"
              className="block text-[11px] font-mono uppercase tracking-[0.16em] text-secondary-token mb-1.5"
            >
              LOCATION NAME
            </label>
            <input
              id="display-name"
              type="text"
              required
              autoFocus
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Main Lobby, Dining Hall, Auditorium"
              className="w-full px-3.5 py-2.5 rounded bg-recessed border border-hairline text-primary-token placeholder-secondary-token text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37] dark:focus:border-[#D4AF37] light:focus:border-[#141413] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="display-zone"
              className="block text-[11px] font-mono uppercase tracking-[0.16em] text-secondary-token mb-1.5"
            >
              ZONE / PANEL SPECIFICATION
            </label>
            <input
              id="display-zone"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Ground Atrium • 4K Panel"
              className="w-full px-3.5 py-2.5 rounded bg-recessed border border-hairline text-primary-token placeholder-secondary-token text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37] dark:focus:border-[#D4AF37] light:focus:border-[#141413] transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="pairing-code"
                className="block text-[11px] font-mono uppercase tracking-[0.16em] text-secondary-token"
              >
                PAIRING CODE
              </label>
              <button
                type="button"
                onClick={handleGenerateNew}
                className="text-[10px] font-mono text-secondary-token hover:text-primary-token transition-colors cursor-pointer"
              >
                Generate New
              </button>
            </div>
            <input
              id="pairing-code"
              type="text"
              required
              maxLength={8}
              value={pairingCode}
              onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
              placeholder="ADK-8982"
              className="w-full px-3.5 py-2.5 rounded bg-recessed border border-hairline text-primary-token placeholder-muted-token text-sm font-mono tracking-[0.2em] tabular-nums font-bold focus:outline-none focus:border-[#D4AF37] dark:focus:border-[#D4AF37] light:focus:border-[#141413] transition-colors uppercase"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-xs font-medium border border-hairline bg-surface hover:bg-recessed text-secondary-token hover:text-primary-token transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !displayName.trim() || !pairingCode.trim()}
              className="btn-ref-primary px-4 py-2 rounded text-xs font-medium disabled:opacity-40 cursor-pointer"
            >
              Bind Display
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
