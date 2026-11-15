import React, { useState, useEffect } from 'react';
import { X, Tv, Laptop, Smartphone, Tablet, CheckSquare, Square, Cast } from 'lucide-react';

export default function CastModal({ isOpen, onClose, devices = [], onConfirmCast }) {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const onlineDevices = devices.filter((d) => d.status === 'online');

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set(onlineDevices.map((d) => d.id)));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleDevice = (id, isOnline) => {
    if (!isOnline) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isAllSelected = onlineDevices.length > 0 && selectedIds.size === onlineDevices.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(onlineDevices.map((d) => d.id)));
    }
  };

  const handleConfirm = () => {
    const chosenList = devices.filter((d) => selectedIds.has(d.id));
    onConfirmCast(chosenList);
    onClose();
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'tv':
        return <Tv className="w-4 h-4" />;
      case 'laptop':
        return <Laptop className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      case 'phone':
      default:
        return <Smartphone className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 font-sans">
      <div
        className="relative w-full max-w-lg rounded bg-surface border border-hairline p-6 shadow-2xl text-primary-token flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cast-modal-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-hairline shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#D4AF37] text-[#0A0A0B] flex items-center justify-center font-bold shadow-none">
              <Cast className="w-4 h-4" />
            </div>
            <div>
              <h3 id="cast-modal-title" className="text-base font-semibold text-primary-token tracking-tight font-sans">
                Target Display Selection
              </h3>
              <p className="text-xs text-secondary-token">
                Choose endpoints for synchronized stream dispatch
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

        <div className="flex items-center justify-between py-3 px-1 text-xs shrink-0 border-b border-hairline font-mono">
          <button
            type="button"
            onClick={handleToggleSelectAll}
            className="flex items-center gap-2 text-secondary-token hover:text-primary-token transition-colors cursor-pointer"
          >
            {isAllSelected ? (
              <CheckSquare className="w-4 h-4 text-brand-accent" />
            ) : (
              <Square className="w-4 h-4 text-muted-token" />
            )}
            <span>{isAllSelected ? 'Deselect All' : 'Select All Online'}</span>
          </button>

          <span className="text-secondary-token">
            <strong className="text-primary-token">{selectedIds.size}</strong> of {onlineDevices.length} online selected
          </span>
        </div>

        <div className="overflow-y-auto py-3 space-y-2 flex-1 pr-1">
          {devices.map((device) => {
            const isOnline = device.status === 'online';
            const isChecked = selectedIds.has(device.id);

            return (
              <div
                key={device.id}
                onClick={() => handleToggleDevice(device.id, isOnline)}
                className={`flex items-center justify-between p-3 rounded border transition-colors ${
                  !isOnline
                    ? 'opacity-40 cursor-not-allowed bg-recessed/40 border-hairline'
                    : isChecked
                    ? 'bg-recessed border-brand-accent cursor-pointer'
                    : 'bg-surface border-hairline hover:border-hover cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                      !isOnline
                        ? 'border-hairline bg-surface'
                        : isChecked
                        ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0A0A0B]'
                        : 'border-hairline bg-surface'
                    }`}
                  >
                    {isChecked && <CheckSquare className="w-3.5 h-3.5" />}
                  </div>

                  <div className="w-7 h-7 rounded flex items-center justify-center shrink-0 bg-recessed border border-hairline text-primary-token">
                    {getDeviceIcon(device.type)}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-primary-token truncate font-sans">{device.name}</p>
                    <p className="text-[11px] text-secondary-token truncate font-mono">
                      {device.resolution || device.model} • <span className="text-muted-token">{device.ipAddress}</span>
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  {isOnline ? (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/30">
                      Online
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-token bg-recessed px-2 py-0.5 rounded border border-hairline">
                      Offline
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-hairline shrink-0">
          <span className="text-xs text-secondary-token font-mono">
            {selectedIds.size === 0 ? (
              <span className="text-rose-400">Select at least 1 online device</span>
            ) : (
              <span>Ready for stream start</span>
            )}
          </span>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn-ref-secondary px-4 py-2 rounded text-xs sm:text-sm font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selectedIds.size === 0}
              onClick={handleConfirm}
              className="btn-ref-primary flex items-center gap-2 px-4 py-2 rounded text-xs sm:text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Cast className="w-4 h-4" />
              <span>Start Broadcast</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
