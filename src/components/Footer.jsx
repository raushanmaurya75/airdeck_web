import React from 'react';
import { Cast, Code2, Cpu, ShieldAlert, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/90 text-slate-400 text-xs py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
            <Cast className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-300">AirDeck Casting Suite</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500">Phase 1: Frontend UI Architecture</span>
        </div>

        {/* Notes */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>React + Vite + Tailwind CSS</span>
          </span>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Modular Mock Layer Ready for WebRTC/Sockets</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
