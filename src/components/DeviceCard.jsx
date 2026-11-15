import React from 'react';
import { Tv, Laptop, Smartphone, Tablet } from 'lucide-react';

export default function DeviceCard({ device, isCasting, isSelected, onToggleSelect, selectable = false }) {
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

  const isOnline = device.status === 'online';

  return (
    <div
      onClick={selectable && isOnline ? onToggleSelect : undefined}
      className={`group rounded p-3.5 border transition-colors ${
        selectable && isOnline ? 'cursor-pointer' : ''
      } ${
        isCasting
          ? 'bg-surface border-brand-accent'
          : isSelected
          ? 'bg-recessed border-brand-accent'
          : isOnline
          ? 'bg-surface border-hairline hover:border-hover'
          : 'bg-page/60 border-hairline opacity-60'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 rounded flex items-center justify-center shrink-0 border ${
              isCasting
                ? 'bg-[#D4AF37] text-[#0A0A0B] border-[#D4AF37]'
                : isOnline
                ? 'bg-recessed text-primary-token border-hairline'
                : 'bg-page text-muted-token border-hairline'
            }`}
          >
            {getDeviceIcon(device.type)}
          </div>

          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-semibold text-primary-token truncate leading-tight font-sans">
              {device.name}
            </h4>

            <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-secondary-token">
              <span className="uppercase text-primary-token">{device.type}</span>
              <span>•</span>
              <span className="truncate text-secondary-token">{device.resolution || device.model}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          {isCasting ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-[0.16em] bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              Casting
            </span>
          ) : isOnline ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-[0.16em] bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              Online
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-[0.16em] bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              Offline
            </span>
          )}

          <span className="text-[10px] text-muted-token font-mono">
            {device.ipAddress}
          </span>
        </div>
      </div>

      {selectable && isOnline && (
        <div className="mt-2.5 pt-2.5 border-t border-hairline flex items-center justify-between text-xs text-secondary-token font-mono">
          <span>Target for broadcast</span>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {}}
            className="w-3.5 h-3.5 rounded text-[#D4AF37] bg-recessed border-hairline cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
