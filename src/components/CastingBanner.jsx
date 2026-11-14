import React from 'react';
import { Cast, Square, Radio, ShieldCheck, MonitorPlay } from 'lucide-react';

export default function CastingBanner({ castingCount = 0, targetDevices = [], onStopCasting }) {
  if (castingCount === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-violet-900 border border-indigo-500/50 p-4 sm:p-5 shadow-2xl shadow-indigo-600/20 text-white animate-in slide-in-from-top-4 duration-300">
      {/* Animated accent gradient pulse */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        {/* Left: Indicator & Status */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40">
              <Cast className="w-6 h-6 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-slate-900"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                Live Broadcast
              </span>
              <span className="text-xs text-indigo-200 font-mono">
                {targetDevices.length > 0 ? `${targetDevices.length} Target Sync` : 'All Devices'}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Casting on {castingCount} {castingCount === 1 ? 'device' : 'devices'}
            </h3>

            <p className="text-xs text-indigo-200/80 hidden sm:block">
              Simulated real-time synchronization active. Connected endpoints are streaming media.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <div className="text-right hidden md:block">
            <div className="text-[11px] font-medium text-emerald-300 flex items-center justify-end gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Low Latency UI Mock</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              ~16ms simulated frame sync
            </div>
          </div>

          <button
            type="button"
            onClick={onStopCasting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>Stop Casting</span>
          </button>
        </div>
      </div>

      {/* Target device pills preview if specific list is active */}
      {targetDevices.length > 0 && (
        <div className="mt-3 pt-3 border-t border-indigo-800/40 flex items-center gap-2 overflow-x-auto text-[11px] text-indigo-200">
          <span className="font-semibold text-slate-300 shrink-0">Receiving:</span>
          {targetDevices.map((d) => (
            <span
              key={d.id}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30 whitespace-nowrap text-indigo-100"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {d.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
