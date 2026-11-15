import React from 'react';
import { Cast, Cpu, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface text-secondary-token text-xs py-6 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#D4AF37] text-[#0A0A0B] flex items-center justify-center font-bold shadow-none">
            <Cast className="w-3 h-3" />
          </div>
          <span className="font-semibold text-primary-token">AirDeck Broadcast Systems</span>
          <span className="text-muted-token">•</span>
          <span className="text-muted-token">Commercial Console v1.0</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-muted-token">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-brand-accent" />
            <span>Direct SoC Acceleration</span>
          </span>
          <span className="text-muted-token hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-[#10B981]" />
            <span>Air-Gapped Flash Persistence</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
