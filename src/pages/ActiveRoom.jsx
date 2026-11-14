import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Check,
  Cast,
  ChevronDown,
  Monitor,
  Tv,
  Smartphone,
  Tablet,
  Radio,
  Share2,
  AlertCircle,
  Play,
  Square,
  Sparkles,
  Users,
  Settings2,
  RefreshCw
} from 'lucide-react';
import { INITIAL_MOCK_DEVICES } from '../mock/devices';
import { getRoomByCode, saveRoom, updateRoomVideo } from '../services/storageService';
import { useToast } from '../context/ToastContext';
import DeviceCard from '../components/DeviceCard';
import VideoPlayer from '../components/VideoPlayer';
import CastModal from '../components/CastModal';
import CastingBanner from '../components/CastingBanner';

export default function ActiveRoom() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { success, info, warning } = useToast();

  const [room, setRoom] = useState(null);
  const [copied, setCopied] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState('all'); // 'all' | 'online'

  // ============================================================================
  // Mock Devices State
  // TODO: replace with real backend/socket logic (e.g. socket.on('device:join'))
  // ============================================================================
  const [devices, setDevices] = useState(INITIAL_MOCK_DEVICES);

  // Casting state
  const [isCasting, setIsCasting] = useState(false);
  const [castingTargetType, setCastingTargetType] = useState('none'); // 'all' | 'specific' | 'none'
  const [targetedDevices, setTargetedDevices] = useState([]); // list of devices receiving cast
  const [isCastDropdownOpen, setIsCastDropdownOpen] = useState(false);
  const [isSpecificModalOpen, setIsSpecificModalOpen] = useState(false);

  // Load room data on mount or code change
  useEffect(() => {
    if (!code) return;
    const existing = getRoomByCode(code);
    if (existing) {
      setRoom(existing);
    } else {
      // Auto-initialize if opened via link directly
      const autoRoom = {
        code: code.toUpperCase(),
        name: `Room ${code.toUpperCase()}`,
        createdAt: new Date().toISOString(),
        video: null,
        contentType: 'video',
      };
      saveRoom(autoRoom);
      setRoom(autoRoom);
    }
  }, [code]);

  // Handle Copy Room Code / Link
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      success('Copied!', `Room code ${code} copied to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      warning('Copy failed', 'Please copy room code manually.');
    }
  };

  // Video Update Handler (persists to localStorage)
  // TODO: replace with real backend/socket logic (socket.emit('room:video_update', video))
  const handleUpdateVideo = (newVideo) => {
    if (!room) return;
    updateRoomVideo(room.code, newVideo);
    setRoom((prev) => ({ ...prev, video: newVideo }));
  };

  // Start Cast to ALL online devices
  // TODO: replace with real backend/socket logic (socket.emit('cast:start', { targets: 'all' }))
  const handleCastAll = () => {
    setIsCastDropdownOpen(false);

    if (!room?.video) {
      warning('No video attached', 'Please load a video before starting the cast.');
      return;
    }

    const onlineDevices = devices.filter((d) => d.status === 'online');
    setIsCasting(true);
    setCastingTargetType('all');
    setTargetedDevices(onlineDevices);

    success(
      'Casting to All Devices!',
      `Stream started on ${onlineDevices.length} online devices.`
    );
  };

  // Start Cast to SPECIFIC devices (from modal)
  // TODO: replace with real backend/socket logic (socket.emit('cast:start', { targetIds }))
  const handleConfirmSpecificCast = (selectedDevices) => {
    if (!room?.video) {
      warning('No video attached', 'Please load a video before starting the cast.');
      return;
    }

    setIsCasting(true);
    setCastingTargetType('specific');
    setTargetedDevices(selectedDevices);

    success(
      'Casting to Selected Devices!',
      `Stream broadcast started on ${selectedDevices.length} devices.`
    );
  };

  // Stop Casting
  // TODO: replace with real backend/socket logic (socket.emit('cast:stop'))
  const handleStopCasting = () => {
    setIsCasting(false);
    setCastingTargetType('none');
    setTargetedDevices([]);
    info('Casting stopped', 'Cast broadcast ended on all target screens.');
  };

  // Quick simulation: simulate device presence heartbeat or connection
  const handleSimulateDeviceToggle = (id) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: d.status === 'online' ? 'offline' : 'online' } : d
      )
    );
  };

  // Filtered devices for panel
  const displayedDevices = useMemo(() => {
    if (deviceFilter === 'online') {
      return devices.filter((d) => d.status === 'online');
    }
    return devices;
  }, [devices, deviceFilter]);

  const onlineCount = useMemo(() => devices.filter((d) => d.status === 'online').length, [devices]);
  const castingTargetIds = useMemo(() => new Set(targetedDevices.map((d) => d.id)), [targetedDevices]);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="text-center p-8">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-400">Loading room session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 pb-16">
      {/* Room Header */}
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Back & Room Info */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white truncate leading-tight">
                  {room.name}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Room
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Session Code:{' '}
                <span className="font-mono font-bold text-indigo-300">{room.code}</span>
              </p>
            </div>
          </div>

          {/* Room Code Badge & Quick Cast Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Room Code Copy Button */}
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-colors"
            >
              <span className="font-mono tracking-wider text-indigo-300">{room.code}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {/* Cast Button with Dropdown */}
            {!isCasting ? (
              <div className="relative">
                <div className="inline-flex rounded-xl shadow-lg shadow-indigo-600/20">
                  <button
                    type="button"
                    onClick={handleCastAll}
                    disabled={!room.video}
                    className="flex items-center gap-2 px-4 py-2 rounded-l-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs sm:text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title={!room.video ? 'Add a video first' : 'Cast to all online devices'}
                  >
                    <Cast className="w-4 h-4" />
                    <span>Cast on All ({onlineCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCastDropdownOpen(!isCastDropdownOpen)}
                    disabled={!room.video}
                    className="px-2.5 py-2 rounded-r-xl bg-indigo-700 hover:bg-indigo-600 text-white border-l border-indigo-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="More cast options"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Dropdown Menu */}
                {isCastDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsCastDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 text-xs text-slate-200 animate-in fade-in zoom-in-95">
                      <button
                        onClick={handleCastAll}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Cast className="w-4 h-4" />
                          <span>Cast on all devices</span>
                        </div>
                        <span className="font-mono text-[10px] opacity-80">{onlineCount}</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsCastDropdownOpen(false);
                          setIsSpecificModalOpen(true);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Settings2 className="w-4 h-4" />
                          <span>Cast on specific devices...</span>
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Stop Casting</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1 w-full space-y-6">
        {/* Casting Status Banner */}
        {isCasting && (
          <CastingBanner
            castingCount={targetedDevices.length}
            targetDevices={targetedDevices}
            onStopCasting={handleStopCasting}
          />
        )}

        {/* Content Layout: Video Column (Left) + Connected Devices Panel (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Video Section & Cast Toolbar (7 Cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <VideoPlayer
              video={room.video}
              onUpdateVideo={handleUpdateVideo}
              isCasting={isCasting}
            />

            {/* Quick Cast Control Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                  <Cast className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Cast Controls</h4>
                  <p className="text-xs text-slate-400">
                    {isCasting
                      ? `Currently broadcasting to ${targetedDevices.length} screens`
                      : 'Choose destination screens to start synchronized playback'}
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
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 disabled:opacity-40 transition-colors"
                    >
                      <Settings2 className="w-4 h-4 text-slate-400" />
                      <span>Choose Devices</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCastAll}
                      disabled={!room.video}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
                    >
                      <Cast className="w-4 h-4" />
                      <span>Cast All ({onlineCount})</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopCasting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02]"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>Stop Cast</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Connected Devices Panel (5 Cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col">
              {/* Panel Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">Connected Devices</h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {devices.length}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {onlineCount} online • {isCasting ? `${targetedDevices.length} casting` : 'Idle'}
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setDeviceFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      deviceFilter === 'all'
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({devices.length})
                  </button>
                  <button
                    onClick={() => setDeviceFilter('online')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      deviceFilter === 'online'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Online ({onlineCount})
                  </button>
                </div>
              </div>

              {/* Devices List */}
              <div className="p-3.5 space-y-2.5 max-h-[600px] overflow-y-auto">
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

              {/* Panel Footer / Simulated Discovery Notice */}
              <div className="p-3.5 bg-slate-950/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  <span>Mock Device Layer</span>
                </span>
                <span className="font-mono text-slate-500">Auto-Heartbeat active</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Specific Devices Cast Modal */}
      <CastModal
        isOpen={isSpecificModalOpen}
        onClose={() => setIsSpecificModalOpen(false)}
        devices={devices}
        onConfirmCast={handleConfirmSpecificCast}
      />
    </div>
  );
}
