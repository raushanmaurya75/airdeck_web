import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cast, RefreshCw, Tv } from 'lucide-react';

export default function DisplayReceiver() {
  const [pairingCode, setPairingCode] = useState('');

  const generatePairingCode = () => {
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `ADK-${code}`;
  };

  useEffect(() => {
    setPairingCode(generatePairingCode());
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F4F4F5] flex flex-col justify-between p-6 sm:p-10 select-none">
      <div className="w-full flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.16em] text-[#52525B] border-b border-[#222225] pb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[#8E8E93]">Native TV Receiver Node</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[#52525B]">
          <span>SoC: Hardware Accelerated</span>
          <span>•</span>
          <span>Resolution: 3840 x 2160 (4K)</span>
          <span>•</span>
          <span>Cache: Ready</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-md rounded-md bg-[#111113] border border-[#222225] p-8 sm:p-10 text-center">
          <div className="w-12 h-12 rounded bg-[#D4AF37] text-[#0A0A0B] flex items-center justify-center mx-auto mb-4 font-bold shadow-none">
            <Cast className="w-6 h-6" />
          </div>

          <h2 className="text-base font-semibold tracking-tight text-[#F4F4F5] font-sans">
            AirDeck Display Endpoint
          </h2>
          <p className="text-xs text-[#8E8E93] mt-1">
            Commercial screen standby mode. Pair from any studio console.
          </p>

          <div className="my-7 p-5 rounded bg-[#161618] border border-[#222225]">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#52525B] mb-2">
              Pairing Security Code
            </div>
            <div className="text-4xl sm:text-5xl font-mono font-bold tracking-[0.25em] text-[#F4F4F5] tabular-nums select-all">
              {pairingCode || 'ADK-••••'}
            </div>
            <button
              onClick={() => setPairingCode(generatePairingCode())}
              className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-mono uppercase tracking-wider text-[#52525B] hover:text-[#8E8E93] transition-colors"
              title="Regenerate code"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Regenerate Code</span>
            </button>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-[#161618] border border-[#222225] text-xs font-mono text-[#8E8E93]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Waiting for host pairing...</span>
          </div>

          <div className="mt-8 pt-6 border-t border-[#222225]">
            <Link
              to="/"
              className="text-xs text-[#52525B] hover:text-[#F4F4F5] font-mono tracking-wider transition-colors inline-block"
            >
              ← Exit Receiver
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#52525B] border-t border-[#222225] pt-4 gap-2">
        <div className="flex items-center gap-2">
          <Tv className="w-3.5 h-3.5 text-[#8E8E93]" />
          <span>AirDeck TV OS Runtime 2.4.0</span>
        </div>
        <div>
          <span>Local Flash Persistent Cache Buffer Active</span>
        </div>
      </div>
    </div>
  );
}
