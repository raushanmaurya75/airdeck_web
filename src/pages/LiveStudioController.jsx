import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Wifi,
  WifiOff,
  Tv,
  Film,
  HardDrive,
  Cpu,
  Check,
  Send,
  Layers
} from 'lucide-react';
import { getDisplayById, updateDisplay } from '../services/storageService';
import { useToast } from '../context/ToastContext';

const PRESET_MEDIA = [
  {
    id: 'media-1',
    title: 'Architectural Showreel 4K (Continuous Loop)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'video',
    duration: '09:56',
    filesize: '142 MB Cached',
  },
  {
    id: 'media-2',
    title: 'Commercial Atrium Ambient Reel (Direct MP4)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    type: 'video',
    duration: '10:53',
    filesize: '188 MB Cached',
  },
  {
    id: 'media-3',
    title: 'Studio Keynote Demo Stream (WebRTC Mock)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    type: 'video',
    duration: '12:14',
    filesize: '215 MB Cached',
  },
];

export default function LiveStudioController() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, warning, info } = useToast();

  const [display, setDisplay] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isWifiCut, setIsWifiCut] = useState(false);
  const [overlayText, setOverlayText] = useState('AIRDECK BROADCAST NODE • DIRECT HARDWARE ACCELERATION');
  const [activeMedia, setActiveMedia] = useState(PRESET_MEDIA[0]);
  const [secondsElapsed, setSecondsElapsed] = useState(258);

  const videoRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    const found = getDisplayById(id);
    if (found) {
      setDisplay(found);
      if (found.overlayText) setOverlayText(found.overlayText);
      if (found.activeMedia?.url) {
        const matching = PRESET_MEDIA.find((m) => m.url === found.activeMedia.url);
        if (matching) setActiveMedia(matching);
      }
    } else {
      warning('Display not found', 'Redirecting back to displays workspace.');
      navigate('/console');
    }
  }, [id, navigate, warning]);

  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const formatTimecode = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const frames = Math.floor((totalSec * 24) % 24);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        info('Playback Paused', 'Hold frame on broadcast output.');
      } else {
        videoRef.current.play();
        info('Playback Resumed', 'Continuous hardware loop active.');
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleResetTimecode = () => {
    setSecondsElapsed(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
    info('Transport Rewound', 'Timecode reset to 00:00:00:00.');
  };

  const handleToggleWifiCut = () => {
    const nextState = !isWifiCut;
    setIsWifiCut(nextState);
    if (nextState) {
      warning(
        'Wi-Fi Connection Severed',
        'Display operating in offline mode using local flash buffer. Playback continues uninterrupted.'
      );
    } else {
      success(
        'Network Re-established',
        'Display reconnected to studio console via TLS 1.3 tunnel.'
      );
    }
  };

  const handleSaveOverlay = (e) => {
    e.preventDefault();
    if (!display) return;
    const updated = updateDisplay(display.id, { overlayText });
    setDisplay(updated);
    success(
      'Overlay Updated',
      'Ticker dispatched to screen Layer 2 preview frame.'
    );
  };

  const handleSelectMedia = (media) => {
    setActiveMedia(media);
    if (display) {
      const updated = updateDisplay(display.id, {
        activeMedia: {
          title: media.title,
          url: media.url,
          type: 'direct',
        },
      });
      setDisplay(updated);
    }
    success('Media Switch Triggered', `Display switched to "${media.title}".`);
  };

  if (!display) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page text-primary-token">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-page text-primary-token pb-16 transition-colors font-sans">
      <section className="border-b border-hairline bg-surface/75 py-3.5 sticky top-14 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/console"
              className="p-1.5 rounded bg-surface hover:bg-recessed text-secondary-token hover:text-primary-token border border-hairline transition-colors shrink-0 cursor-pointer"
              title="Return to Displays"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-semibold text-primary-token truncate leading-tight font-sans">
                  {display.name}
                </h1>
                {isWifiCut ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-[0.16em] bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                    OFFLINE • FLASH BUFFER
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-[0.16em] bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    ONLINE • IN SYNC
                  </span>
                )}
              </div>
              <p className="text-xs text-secondary-token font-mono mt-0.5">
                {display.location} • PIN:{' '}
                <span className="font-bold text-primary-token tracking-[0.16em]">{display.pairingCode}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-secondary-token">
            <span className="hidden md:inline-flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-muted-token" />
              <span>{display.resolution || '4K UHD'}</span>
            </span>
            <span className="text-muted-token hidden md:inline">•</span>
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-brand-accent" />
              <span>Flash Cache Active</span>
            </span>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-lg bg-[#000000] border border-hairline overflow-hidden relative aspect-video flex flex-col justify-between shadow-2xl">
              <div className="p-3 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-[11px] font-mono text-white/90 z-20 pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#0A0A0B]/80 border border-[#343438] text-[10px] uppercase font-bold tracking-wider text-[#D4AF37]">
                    STUDIO LIVE FEED
                  </span>
                  <span className="text-white/80 font-mono">1080p60 • AVC Direct</span>
                </div>

                {isWifiCut ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 flex items-center gap-1.5">
                    <WifiOff className="w-3 h-3 text-[#F59E0B]" />
                    LOCAL FLASH AUTONOMOUS
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 flex items-center gap-1.5">
                    <Wifi className="w-3 h-3 text-[#10B981]" />
                    WSS SUB-FRAME SYNC
                  </span>
                )}
              </div>

              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <video
                  ref={videoRef}
                  src={activeMedia.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="relative z-20 bg-[#0A0A0B]/90 backdrop-blur-md border-t border-[#222225] px-4 py-2.5 flex items-center gap-3">
                <div className="px-1.5 py-0.5 rounded bg-[#D4AF37] text-[#0A0A0B] text-[10px] font-mono font-bold uppercase tracking-[0.16em] shrink-0">
                  OVERLAY
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="font-mono text-xs text-white font-medium tracking-wide truncate">
                    {overlayText || 'AIRDECK BROADCAST NODE • DIRECT HARDWARE ACCELERATION'}
                  </p>
                </div>
                <div className="text-[10px] font-mono text-[#10B981] shrink-0 uppercase tracking-widest hidden sm:block">
                  LAYER 2 OK
                </div>
              </div>
            </div>

            <div className="rounded bg-surface border border-hairline p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="w-9 h-9 rounded flex items-center justify-center btn-ref-primary shrink-0 cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetTimecode}
                  className="p-2 rounded bg-recessed hover:bg-surface border border-hairline text-secondary-token hover:text-primary-token transition-colors cursor-pointer"
                  title="Rewind to 00:00:00:00"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <div className="px-3 py-1.5 rounded bg-recessed border border-hairline font-mono text-xs sm:text-sm font-bold text-primary-token tracking-[0.16em] tabular-nums select-all">
                  {formatTimecode(secondsElapsed)}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                {isWifiCut ? (
                  <span className="inline-flex items-center gap-1.5 text-[#F59E0B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    <span>Flash Playback • 0ms drift</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[#10B981]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    <span>In Sync • 0ms drift</span>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleToggleWifiCut}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-mono font-medium transition-colors border cursor-pointer ${
                  isWifiCut
                    ? 'bg-[#F59E0B] text-[#0A0A0B] border-[#F59E0B] font-bold'
                    : 'bg-recessed text-secondary-token hover:text-primary-token border-hairline hover:border-hover'
                }`}
                title="Toggle simulated network disconnection to demo offline flash playback"
              >
                {isWifiCut ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>Wi-Fi Cut Simulated</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-secondary-token" />
                    <span>Simulate Wi-Fi Cut</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="rounded bg-surface border border-hairline p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-hairline">
                <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-brand-accent flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Layer 2 Live Overlay</span>
                </span>
                <span className="text-[10px] font-mono text-muted-token">Real-time Preview</span>
              </div>

              <form onSubmit={handleSaveOverlay} className="space-y-3">
                <div>
                  <label
                    htmlFor="overlay-input"
                    className="block text-[11px] font-mono text-secondary-token mb-1"
                  >
                    Ticker Message
                  </label>
                  <textarea
                    id="overlay-input"
                    rows={3}
                    value={overlayText}
                    onChange={(e) => setOverlayText(e.target.value)}
                    placeholder="Enter ticker text..."
                    className="w-full px-3 py-2 rounded bg-recessed border border-hairline text-primary-token placeholder-muted-token text-xs font-mono focus:outline-none focus:border-[#D4AF37] dark:focus:border-[#D4AF37] light:focus:border-[#141413] transition-colors leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setOverlayText('CONFERENCE KEYNOTE • Q4 GLOBAL SYNC MANIFEST')
                      }
                      className="px-2 py-0.5 rounded bg-recessed border border-hairline text-[10px] font-mono text-secondary-token hover:text-primary-token cursor-pointer"
                    >
                      Preset A
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setOverlayText('SPECIAL BROADCAST • LOW LATENCY DEMO ACTIVE')
                      }
                      className="px-2 py-0.5 rounded bg-recessed border border-hairline text-[10px] font-mono text-secondary-token hover:text-primary-token cursor-pointer"
                    >
                      Preset B
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium btn-ref-primary cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Push Ticker</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded bg-surface border border-hairline p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-hairline">
                <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-brand-accent flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5" />
                  <span>Media Switcher</span>
                </span>
                <span className="text-[10px] font-mono text-muted-token">Flash Cached</span>
              </div>

              <div className="space-y-2">
                {PRESET_MEDIA.map((item) => {
                  const isSelected = activeMedia.id === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectMedia(item)}
                      className={`w-full text-left p-2.5 rounded border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-recessed border-[#D4AF37] dark:border-[#D4AF37] light:border-[#141413]'
                          : 'bg-recessed/60 border-hairline hover:border-hover'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-primary-token truncate font-sans">
                          {item.title}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />}
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[11px] font-mono text-secondary-token">
                        <span>{item.duration}</span>
                        <span>{item.filesize}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded bg-surface border border-hairline p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-hairline">
                <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-brand-accent flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Hardware Telemetry</span>
                </span>
                <span className="text-[10px] font-mono text-[#10B981]">SoC Direct</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded bg-recessed border border-hairline">
                  <span className="text-secondary-token">SoC Storage:</span>
                  <span className="text-primary-token font-medium">{display.socStorage || '12.4 GB / 32 GB Used'}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-recessed border border-hairline">
                  <span className="text-secondary-token">Endpoint Uptime:</span>
                  <span className="text-primary-token font-medium">{display.uptime || '14d 08h 22m'}</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-recessed border border-hairline">
                  <span className="text-secondary-token">Outbound WSS:</span>
                  {isWifiCut ? (
                    <span className="text-[#F59E0B] font-medium">Severed (Flash Active)</span>
                  ) : (
                    <span className="text-[#10B981] font-medium">Connected • 16ms RTT</span>
                  )}
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-recessed border border-hairline">
                  <span className="text-secondary-token">Buffer Protocol:</span>
                  <span className="text-primary-token font-medium">Local Persistent Flash</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
