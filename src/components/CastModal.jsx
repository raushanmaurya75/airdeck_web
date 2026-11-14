import React, { useState, useEffect } from 'react';
import { X, Tv, Laptop, Smartphone, Tablet, CheckSquare, Square, Radio, Cast } from 'lucide-react';

export default function CastModal({ isOpen, onClose, devices = [], onConfirmCast }) {
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Only consider online devices as castable
  const onlineDevices = devices.filter((d) => d.status === 'online');

  // Pre-select all online devices on open by default or keep previous selection
  useEffect(() => {
    if (isOpen) {
      // By default select all online devices for user convenience
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-7 overflow-hidden text-slate-100 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cast-modal-title"
      >
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Cast className="w-5 h-5" />
            </div>
            <div>
              <h3 id="cast-modal-title" className="text-lg font-bold text-white tracking-tight">
                Cast to Specific Devices
              </h3>
              <p className="text-xs text-slate-400">
                Select target screens to broadcast stream
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

        {/* Select All Bar */}
        <div className="flex items-center justify-between py-3 px-1 text-xs shrink-0 border-b border-slate-800/80">
          <button
            type="button"
            onClick={handleToggleSelectAll}
            className="flex items-center gap-2 font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {isAllSelected ? (
              <CheckSquare className="w-4 h-4 text-indigo-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-500" />
            )}
            <span>{isAllSelected ? 'Deselect All' : 'Select All Online Devices'}</span>
          </button>

          <span className="text-slate-400">
            <strong className="text-white">{selectedIds.size}</strong> of {onlineDevices.length} online selected
          </span>
        </div>

        {/* Scrollable Device Selection List */}
        <div className="overflow-y-auto py-3 space-y-2.5 flex-1 pr-1">
          {devices.map((device) => {
            const isOnline = device.status === 'online';
            const isChecked = selectedIds.has(device.id);

            return (
              <div
                key={device.id}
                onClick={() => handleToggleDevice(device.id, isOnline)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  !isOnline
                    ? 'opacity-40 cursor-not-allowed bg-slate-950/40 border-slate-900'
                    : isChecked
                    ? 'bg-indigo-950/40 border-indigo-500/50 cursor-pointer shadow-sm shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
                      !isOnline
                        ? 'border-slate-700 bg-slate-800'
                        : isChecked
                        ? 'border-indigo-500 bg-indigo-600 text-white'
                        : 'border-slate-600 bg-slate-950'
                    }`}
                  >
                    {isChecked && <CheckSquare className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isChecked ? 'bg-indigo-600/20 text-indigo-400' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {getDeviceIcon(device.type)}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{device.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {device.resolution || device.model} • <span className="font-mono text-slate-500">{device.ipAddress}</span>
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  {isOnline ? (
                    <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      Online
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                      Offline
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 shrink-0">
          <span className="text-xs text-slate-400">
            {selectedIds.size === 0 ? (
              <span className="text-rose-400">Select at least 1 online device</span>
            ) : (
              <span>Ready to broadcast</span>
            )}
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selectedIds.size === 0}
              onClick={handleConfirm}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Cast className="w-4 h-4" />
              <span>Confirm & Start Cast</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
