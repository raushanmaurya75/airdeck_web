import React from 'react';
import { Cast, Square, ShieldCheck } from 'lucide-react';

export default function CastingBanner({ castingCount = 0, targetDevices = [], onStopCasting }) {
  if (castingCount === 0) return null;

  return (
    <div className="rounded bg-surface border border-brand-accent p-4 sm:p-5 text-primary-token transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded bg-[#D4AF37] text-[#0A0A0B] flex items-center justify-center font-bold shrink-0 shadow-none">
            <Cast className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-[0.16em] bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                Live Broadcast
              </span>
              <span className="text-xs text-secondary-token font-mono">
                {targetDevices.length > 0 ? `${targetDevices.length} Target Sync` : 'All Devices Sync'}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-semibold text-primary-token mt-1 font-sans">
              Broadcasting to {castingCount} {castingCount === 1 ? 'screen' : 'screens'}
            </h3>

            <p className="text-xs text-secondary-token hidden sm:block mt-0.5">
              Deterministic real-time frame synchronization active across paired hardware endpoints.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <div className="text-right hidden md:block">
            <div className="text-[11px] font-mono text-[#10B981] flex items-center justify-end gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Low Latency Sync</span>
            </div>
            <div className="text-[10px] text-muted-token font-mono">
              ~16ms sub-frame precision
            </div>
          </div>

          <button
            type="button"
            onClick={onStopCasting}
            className="flex items-center gap-2 px-3.5 py-2 rounded text-xs sm:text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 border border-rose-500 transition-colors cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-white" />
            <span>Stop Casting</span>
          </button>
        </div>
      </div>

      {targetDevices.length > 0 && (
        <div className="mt-3 pt-3 border-t border-hairline flex items-center gap-2 overflow-x-auto text-[11px] font-mono text-secondary-token">
          <span className="text-muted-token shrink-0 uppercase tracking-wider">Receiving:</span>
          {targetDevices.map((d) => (
            <span
              key={d.id}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-recessed border border-hairline whitespace-nowrap text-secondary-token"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              {d.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
