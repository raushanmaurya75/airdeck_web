import React, { useState, useEffect } from 'react';
import {
  Cast,
  Plus,
  Tv,
  Monitor,
  Search,
  Sparkles,
  Wifi,
  ArrowRight,
  FolderOpen,
  Info
} from 'lucide-react';
import RoomCard from '../components/RoomCard';
import CreateRoomModal from '../components/CreateRoomModal';
import { getRooms, deleteRoom } from '../services/storageService';
import { useToast } from '../context/ToastContext';

export default function Dashboard() {
  const { success, info } = useToast();
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Load saved rooms from localStorage
  // TODO: replace with real backend API call (e.g. GET /api/rooms)
  const refreshRooms = () => {
    const loaded = getRooms();
    setRooms(loaded);
  };

  useEffect(() => {
    refreshRooms();
  }, []);

  const handleDeleteRoom = (code) => {
    deleteRoom(code);
    success('Room deleted', `Room ${code} was removed`);
    refreshRooms();
  };

  const handleRoomCreated = () => {
    refreshRooms();
  };

  // Filtered rooms
  const filteredRooms = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-indigo-950/30 via-slate-950 to-slate-950 py-12 sm:py-16">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Next-Generation Multi-Device Casting UI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Broadcast Synchronized Media across{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              Any Screen
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Create an instant room, generate a secure shareable code, load your video,
            and cast in real-time to laptops, smart TVs, tablets, and phones simultaneously.
          </p>

          {/* Prominent CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Create Room</span>
            </button>

            <a
              href="#saved-rooms"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-sm transition-colors"
            >
              <span>View Saved Rooms ({rooms.length})</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Feature Highlights */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
              <Tv className="w-5 h-5 text-indigo-400 mb-2" />
              <div className="text-xs font-bold text-white">Smart TVs & Displays</div>
              <div className="text-[11px] text-slate-400 mt-0.5">4K OLED & Conference monitors</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
              <Monitor className="w-5 h-5 text-violet-400 mb-2" />
              <div className="text-xs font-bold text-white">Laptops & Workstations</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Mac, Windows & Linux browsers</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
              <Wifi className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="text-xs font-bold text-white">Instant Room Codes</div>
              <div className="text-[11px] text-slate-400 mt-0.5">One-click copy & share</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm">
              <Cast className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="text-xs font-bold text-white">Targeted or All-Cast</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Granular endpoint control</div>
            </div>
          </div>
        </div>
      </section>

      {/* Saved Rooms Section */}
      <section id="saved-rooms" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {/* Section Header with Search and Create CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Saved Rooms
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {rooms.length}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Saved session rooms stored locally on this machine
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rooms or code..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Create Room Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Room</span>
            </button>
          </div>
        </div>

        {/* Rooms Grid or Empty State */}
        {filteredRooms.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.code}
                room={room}
                onDelete={handleDeleteRoom}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 p-12 text-center rounded-3xl bg-slate-900/30 border border-slate-800/80 max-w-lg mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mb-4">
              <FolderOpen className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              {searchQuery ? 'No matching rooms found' : 'No saved rooms yet'}
            </h3>

            <p className="text-xs text-slate-400 max-w-xs mb-6">
              {searchQuery
                ? `No room matches query "${searchQuery}". Try searching another name or clear filter.`
                : 'Create your first room to generate a shareable code, add video content, and cast to connected devices.'}
            </p>

            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Create your first room</span>
              </button>
            )}
          </div>
        )}
      </section>

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onRoomCreated={handleRoomCreated}
      />
    </div>
  );
}
