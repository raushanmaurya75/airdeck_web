import React from 'react';
import { Tv, Laptop, Smartphone, Tablet, Radio, Wifi, WifiOff } from 'lucide-react';

export default function DeviceCard({ device, isCasting, isSelected, onToggleSelect, selectable = false }) {
  const getDeviceIcon = (type) => {
    switch (type) {
      case 'tv':
        return <Tv className="w-5 h-5" />;
      case 'laptop':
        return <Laptop className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      case 'phone':
      default:
        return <Smartphone className="w-5 h-5" />;
    }
  };

  const isOnline = device.status === 'online';

  return (
    <div
      onClick={selectable && isOnline ? onToggleSelect : undefined}
      className={`group relative rounded-xl p-3.5 border transition-all duration-300 ${
        selectable && isOnline ? 'cursor-pointer' : ''
      } ${
        isCasting
          ? 'bg-gradient-to-r from-indigo-950/80 via-slate-900 to-violet-950/80 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/50 scale-[1.01]'
          : isSelected
          ? 'bg-indigo-900/30 border-indigo-500/60'
          : isOnline
          ? 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900'
          : 'bg-slate-950/40 border-slate-900/60 opacity-60'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Device Icon + Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              isCasting
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/40 animate-pulse'
                : isOnline
                ? 'bg-slate-800 text-indigo-400 group-hover:bg-indigo-600/20'
                : 'bg-slate-900 text-slate-500'
            }`}
          >
            {getDeviceIcon(device.type)}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white truncate leading-tight">
                {device.name}
              </h4>
            </div>

            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
              <span className="capitalize text-slate-300">{device.type}</span>
              <span>•</span>
              <span className="truncate">{device.resolution || device.model}</span>
            </div>
          </div>
        </div>

        {/* Status / Casting Indicator */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          {isCasting ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-wider animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Casting
            </span>
          ) : isOnline ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Online
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-500 border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              Offline
            </span>
          )}

          <span className="text-[10px] text-slate-500 font-mono">
            {device.ipAddress}
          </span>
        </div>
      </div>

      {/* Selectable checkbox when in selection mode */}
      {selectable && isOnline && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Target device for cast</span>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}} // handled by card click
            className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-indigo-500 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
