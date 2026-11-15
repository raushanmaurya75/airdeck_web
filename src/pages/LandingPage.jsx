import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cast,
  ArrowRight,
  Sun,
  Moon,
  Tv
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { toggleTheme, isDark } = useTheme();
  const { isAuthenticated } = useAuth();

  const [activeNodeId, setActiveNodeId] = useState('node-03');

  const nodes = [
    {
      id: 'node-01',
      step: '01.',
      title: 'Studio Console',
      sub: 'WEB / MOBILE PWA',
      headerTag: 'WEB CONSOLE • ORCHESTRATION',
      line1: 'Dispatches scheduled media manifests and overlay ticker commands via lightweight WebSockets.',
      line2: 'Allows remote operators to update screen content from any mobile or desktop browser without app installation.',
    },
    {
      id: 'node-02',
      step: '02.',
      title: 'Encrypted Sync',
      sub: 'OUTBOUND HTTPS / WSS :443',
      headerTag: 'ZERO-TRUST RELAY • MUTUAL TLS',
      line1: 'Establishes outbound-only mutual TLS 1.3 tunnels to traverse enterprise NATs without open inbound ports.',
      line2: 'Continuous heartbeat synchronization confirms display health and pushes delta-compressed media packages.',
    },
    {
      id: 'node-03',
      step: '03.',
      title: 'Native TV Cache',
      sub: 'ANDROID TV SOC • ATOMIC STORAGE',
      headerTag: 'ANDROID TV SOC • ATOMIC STORAGE',
      line1: 'Executes natively on commercial panel processors with hardware-accelerated 4K MediaCodec decoding.',
      line2: 'Store-and-forward flash caching guarantees uninterrupted playback through complete network outages.',
    },
  ];

  const currentNode = nodes.find((n) => n.id === activeNodeId) || nodes[2];

  return (
    <div className="min-h-screen flex flex-col bg-page text-primary-token transition-colors selection:bg-[#D4AF37] selection:text-[#0A0A0B] font-sans">
      <header className="h-16 border-b border-hairline bg-surface/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group focus:outline-none cursor-pointer" title="AirDeck Home">
            <div className="w-8 h-8 rounded bg-[#D4AF37] text-[#0A0A0B] flex items-center justify-center font-bold shadow-none">
              <Cast className="w-4 h-4" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-primary-token font-sans">
              AirDeck
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-[#D4AF37]" />
              ) : (
                <Moon className="w-4 h-4 text-[#141413]" />
              )}
            </button>

            <Link
              to={isAuthenticated ? '/console' : '/login'}
              className="px-4 py-2 rounded text-xs sm:text-sm font-medium border border-hairline bg-surface hover:bg-recessed hover:border-hover text-primary-token transition-colors cursor-pointer"
            >
              <span>{isAuthenticated ? 'Console' : 'Sign In'}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-accent mb-4 font-semibold">
              ENTERPRISE SIGNAGE INFRASTRUCTURE
            </div>

            <h1 className="font-sans text-4xl sm:text-6xl font-bold tracking-tight text-primary-token leading-tight">
              Autonomous Broadcast Control<br />for Commercial Displays.
            </h1>

            <p className="mt-4 text-sm sm:text-base text-secondary-token leading-relaxed max-w-2xl font-sans">
              Deploy native Android TV playback directly on commercial panels with local store-and-forward caching, instant mobile scheduling, and zero recurring screen fees.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to={isAuthenticated ? '/console' : '/login'}
                className="btn-ref-primary px-5 py-2.5 rounded text-xs sm:text-sm font-medium flex items-center justify-center gap-2 text-center"
              >
                <span>{isAuthenticated ? 'Open Studio Console' : 'Sign In to Console'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/receiver"
                className="btn-ref-secondary px-5 py-2.5 rounded text-xs sm:text-sm font-medium flex items-center justify-center gap-2 text-center"
              >
                <Tv className="w-4 h-4 text-brand-accent" />
                <span>Launch Display Receiver</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 border-t border-hairline bg-page transition-colors">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.16em] text-secondary-token">
                SYSTEM PIPELINE ARCHITECTURE — SELECT NODE TO INSPECT
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.16em] text-brand-accent font-semibold">
                {currentNode.headerTag}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
              {nodes.map((node) => {
                const isSelected = activeNodeId === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveNodeId(node.id)}
                    className={`text-left p-4 rounded border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-surface border-[#D4AF37] dark:border-[#D4AF37] light:border-[#9A7B2C]'
                        : 'bg-surface/75 border-hairline hover:border-hover'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-semibold text-brand-accent">
                        {node.step}
                      </span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isSelected
                            ? 'bg-[#D4AF37] dark:bg-[#D4AF37] light:bg-[#9A7B2C]'
                            : 'bg-recessed border border-hairline'
                        }`}
                      />
                    </div>
                    <h3 className="font-sans font-semibold text-sm text-primary-token leading-tight">
                      {node.title}
                    </h3>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-secondary-token mt-1">
                      {node.sub}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 p-4 rounded bg-surface border border-hairline text-xs font-mono text-secondary-token space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="text-brand-accent font-bold">&gt;_</span>
                <p className="leading-relaxed text-primary-token">
                  {currentNode.line1}
                </p>
              </div>
              <div className="flex items-start gap-2 pl-4">
                <p className="leading-relaxed text-secondary-token">
                  {currentNode.line2}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 border-t border-hairline max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-hairline">
            <div className="pb-6 md:pb-0 md:pr-6">
              <span className="font-mono text-xs font-bold tracking-[0.16em] uppercase text-brand-accent block mb-2">
                DIRECT SOC
              </span>
              <p className="text-xs text-secondary-token leading-relaxed font-sans">
                Native Android TV execution with zero external dongles or media sticks.
              </p>
            </div>

            <div className="py-6 md:py-0 md:px-6">
              <span className="font-mono text-xs font-bold tracking-[0.16em] uppercase text-brand-accent block mb-2">
                AIR-GAPPED READY
              </span>
              <p className="text-xs text-secondary-token leading-relaxed font-sans">
                Asynchronous local caching guarantees uninterrupted loops during network outages.
              </p>
            </div>

            <div className="pt-6 md:pt-0 md:pl-6">
              <span className="font-mono text-xs font-bold tracking-[0.16em] uppercase text-brand-accent block mb-2">
                ZERO INBOUND PORTS
              </span>
              <p className="text-xs text-secondary-token leading-relaxed font-sans">
                Outbound-only TLS architecture compliant with strict institutional firewalls.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline py-6 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-muted-token">
          <span>AirDeck Systems</span>
          <span>Private Self-Hosted Deployment</span>
        </div>
      </footer>
    </div>
  );
}
