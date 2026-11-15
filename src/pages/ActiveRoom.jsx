import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Cast,
  Copy,
  Check,
  Settings2,
  Square,
  Radio,
  ChevronDown
} from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import DeviceCard from '../components/DeviceCard';
import CastingBanner from '../components/CastingBanner';
import CastModal from '../components/CastModal';
import { getRoomByCode, updateRoom } from '../services/storageService';
import { useToast } from '../context/ToastContext';

const INITIAL_MOCK_DEVICES = [
  {
    id: 'dev-1',
    name: 'Sony Bravia 4K XR (Main Lobby)',
    type: 'tv',
    status: 'online',
    resolution: '3840x2160',
    ipAddress: '192.168.1.101',
  },
  {
    id: 'dev-2',
    name: 'Samsung Frame Pro (Design Studio)',
    type: 'tv',
    status: 'online',
    resolution: '3840x2160',
    ipAddress: '192.168.1.102',
  },
  {
    id: 'dev-3',
    name: 'MacBook Pro Display (Host Station)',
    type: 'laptop',
    status: 'online',
    resolution: '3024x1964',
    ipAddress: '192.168.1.103',
  },
  {
    id: 'dev-4',
    name: 'iPad Pro Stage Display (Presenter)',
    type: 'tablet',
    status: 'offline',
    resolution: '2732x2048',
    ipAddress: '192.168.1.104',
  },
];

export default function ActiveRoom() {
  const { code } = useParams();
  const { success, info, warning } = useToast();

  const [room, setRoom] = useState(null);
  const [devices] = useState(INITIAL_MOCK_DEVICES);

  const [isCasting, setIsCasting] = useState(false);
  const [targetedDevices, setTargetedDevices] = useState([]);
  const [copied, setCopied] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [isSpecificModalOpen, setIsSpecificModalOpen] = useState(false);
  const [isCastDropdownOpen, setIsCastDropdownOpen] = useState(false);

  useEffect(() => {
    if (!code) return;
    const existing = getRoomByCode(code);
    if (existing) {
      setRoom(existing);
    } else {
      warning('Room not found', `Could not find room with code ${code}.`);
    }
  }, [code, warning]);

  const handleCopyCode = async () => {
    if (!room) return;
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      success('Copied to clipboard', `Room address ${room.code} is ready to share.`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      info('Copy code', room.code);
    }
  };

  const handleUpdateVideo = (videoData) => {
    if (!room) return;
    const updated = updateRoom(room.code, { video: videoData });
    setRoom(updated);
  };

  const handleCastAll = () => {
    if (!room?.video) {
      warning('Video required', 'Please load a video URL or upload a file before casting.');
      return;
    }
    const onlineList = devices.filter((d) => d.status === 'online');
    setTargetedDevices(onlineList);
    setIsCasting(true);
    setIsCastDropdownOpen(false);
    success(
      'Synchronized Cast Active',
      `Broadcasting "${room.video.title}" across ${onlineList.length} screens.`
    );
  };

  const handleConfirmSpecificCast = (selectedDevices) => {
    if (selectedDevices.length === 0) return;
    setTargetedDevices(selectedDevices);
    setIsCasting(true);
    success(
      'Broadcast Started',
      `Synchronized stream dispatched to ${selectedDevices.length} chosen displays.`
    );
  };

  const handleStopCasting = () => {
    setIsCasting(false);
    setTargetedDevices([]);
    info('Broadcast Terminated', 'All screens returned to standby raster mode.');
  };

  const onlineCount = devices.filter((d) => d.status === 'online').length;
  const displayedDevices =
    deviceFilter === 'online'
      ? devices.filter((d) => d.status === 'online')
      : devices;

  const castingTargetIds = new Set(targetedDevices.map((d) => d.id));

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page text-primary-token">
        <div className="text-center p-8">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-secondary-token">Loading session telemetry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-page text-primary-token pb-16 transition-colors">
      <div className="border-b border-hairline bg-surface/75 backdrop-blur-md sticky top-16 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/console"
              className="p-2 rounded bg-surface hover:bg-recessed text-secondary-token hover:text-primary-token border border-hairline transition-colors shrink-0 cursor-pointer"
              title="Back to Console"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-semibold text-primary-token truncate leading-tight font-sans">
                  {room.name}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-[0.16em] bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  Session Active
                </span>
              </div>
              <p className="text-xs text-secondary-token font-mono mt-0.5">
                Address:{' '}
                <span className="font-semibold text-primary-token tracking-[0.16em]">{room.code}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface hover:bg-recessed border border-hairline text-xs font-mono text-primary-token transition-colors cursor-pointer"
            >
              <span className="tracking-[0.22em] tabular-nums font-semibold text-primary-token">{room.code}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-secondary-token" />
              )}
            </button>

            {!isCasting ? (
              <div className="relative">
                <div className="inline-flex rounded">
                  <button
                    type="button"
                    onClick={handleCastAll}
                    disabled={!room.video}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-l text-xs sm:text-sm font-medium btn-ref-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    title={!room.video ? 'Load video source first' : 'Broadcast to all online displays'}
                  >
                    <Cast className="w-4 h-4" />
                    <span>Cast on All ({onlineCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCastDropdownOpen(!isCastDropdownOpen)}
                    disabled={!room.video}
                    className="px-2 py-1.5 rounded-r bg-[#D4AF37] hover:brightness-105 text-[#0A0A0B] border-l border-[#0A0A0B]/20 disabled:opacity-50 transition-colors cursor-pointer"
                    aria-label="More cast options"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {isCastDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsCastDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded bg-surface border border-hairline p-1.5 z-50 text-xs text-primary-token shadow-xl">
                      <button
                        onClick={handleCastAll}
                        className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-recessed transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Cast className="w-3.5 h-3.5 text-brand-accent" />
                          <span>Cast on all online</span>
                        </div>
                        <span className="font-mono text-[10px] text-secondary-token">{onlineCount}</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsCastDropdownOpen(false);
                          setIsSpecificModalOpen(true);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-recessed transition-colors text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Settings2 className="w-3.5 h-3.5 text-secondary-token" />
                          <span>Choose target devices...</span>
                        </div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStopCasting}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-medium border border-rose-500 transition-colors cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>Stop Cast</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1 w-full space-y-6">
        {isCasting && (
          <CastingBanner
            castingCount={targetedDevices.length}
            targetDevices={targetedDevices}
            onStopCasting={handleStopCasting}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <VideoPlayer
              video={room.video}
              onVideoChange={handleUpdateVideo}
              isCasting={isCasting}
            />

            <div className="p-4 sm:p-5 rounded bg-surface border border-hairline flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-recessed border border-hairline flex items-center justify-center text-brand-accent shrink-0 font-bold">
                  <Cast className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-primary-token font-sans">
                    Broadcast Orchestration
                  </h4>
                  <p className="text-xs text-secondary-token font-mono">
                    {isCasting
                      ? `Sync active across ${targetedDevices.length} hardware endpoints`
                      : 'Select target devices to begin synchronized playback'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {!isCasting ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsSpecificModalOpen(true)}
                      disabled={!room.video}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded text-xs font-medium btn-ref-secondary disabled:opacity-40 cursor-pointer"
                    >
                      <Settings2 className="w-3.5 h-3.5 text-secondary-token" />
                      <span>Choose Displays</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCastAll}
                      disabled={!room.video}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded text-xs sm:text-sm font-medium btn-ref-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Cast className="w-4 h-4" />
                      <span>Broadcast All ({onlineCount})</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopCasting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded bg-rose-600 hover:bg-rose-500 text-xs sm:text-sm font-medium text-white transition-colors cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>Stop Broadcast</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            <div className="rounded bg-surface border border-hairline overflow-hidden flex flex-col">
              <div className="p-4 border-b border-hairline bg-recessed/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-primary-token text-sm sm:text-base font-sans">
                      Paired Devices
                    </h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface text-secondary-token border border-hairline">
                      {devices.length}
                    </span>
                  </div>
                  <p className="text-xs text-secondary-token mt-0.5 font-mono">
                    {onlineCount} online • {isCasting ? `${targetedDevices.length} streaming` : 'Standby'}
                  </p>
                </div>

                <div className="flex items-center p-0.5 bg-surface rounded border border-hairline text-xs font-mono">
                  <button
                    onClick={() => setDeviceFilter('all')}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                      deviceFilter === 'all'
                        ? 'bg-recessed text-primary-token'
                        : 'text-secondary-token hover:text-primary-token'
                    }`}
                  >
                    All ({devices.length})
                  </button>
                  <button
                    onClick={() => setDeviceFilter('online')}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                      deviceFilter === 'online'
                        ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                        : 'text-secondary-token hover:text-primary-token'
                    }`}
                  >
                    Online ({onlineCount})
                  </button>
                </div>
              </div>

              <div className="p-3.5 space-y-2 max-h-[600px] overflow-y-auto">
                {displayedDevices.map((device) => {
                  const isDeviceCasting = isCasting && castingTargetIds.has(device.id);

                  return (
                    <DeviceCard
                      key={device.id}
                      device={device}
                      isCasting={isDeviceCasting}
                    />
                  );
                })}
              </div>

              <div className="p-3 bg-surface border-t border-hairline text-[11px] font-mono text-secondary-token flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>mDNS Local Discovery</span>
                </span>
                <span className="text-muted-token">Autonomous Sync</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CastModal
        isOpen={isSpecificModalOpen}
        onClose={() => setIsSpecificModalOpen(false)}
        devices={devices}
        onConfirmCast={handleConfirmSpecificCast}
      />
    </div>
  );
}
