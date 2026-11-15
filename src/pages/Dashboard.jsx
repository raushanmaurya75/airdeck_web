import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  FolderOpen
} from 'lucide-react';
import RoomCard from '../components/RoomCard';
import CreateRoomModal from '../components/CreateRoomModal';
import { getRooms, deleteRoom } from '../services/storageService';
import { useToast } from '../context/ToastContext';

export default function Dashboard() {
  const { success } = useToast();
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const filteredRooms = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-page text-primary-token pb-16 transition-colors">
      <section className="border-b border-hairline bg-surface/75 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-[0.16em] px-2 py-0.5 rounded bg-recessed border border-hairline text-brand-accent">
                  STUDIO CONSOLE
                </span>
                <span className="text-muted-token font-mono">•</span>
                <span className="text-xs font-mono text-secondary-token">
                  Local Storage Pipeline
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-primary-token font-sans">
                Broadcast Sessions & Display Rooms
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-secondary-token max-w-xl">
                Manage deterministic media casting rooms and monitor paired commercial screen receivers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded text-xs sm:text-sm font-medium btn-ref-primary cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Initialize Room</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-hairline">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-primary-token tracking-tight font-sans">
                Active Session Rooms
              </h2>
              <span className="text-xs font-mono tabular-nums px-2 py-0.5 rounded bg-recessed text-secondary-token border border-hairline">
                {rooms.length}
              </span>
            </div>
            <p className="text-xs text-secondary-token mt-0.5">
              Hardware-addressed casting channels configured in this browser
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-secondary-token absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rooms or code..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded bg-surface border border-hairline text-primary-token placeholder-muted-token focus:outline-none focus:border-[#D4AF37] dark:focus:border-[#D4AF37] light:focus:border-[#141413] transition-colors"
              />
            </div>
          </div>
        </div>

        {filteredRooms.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.code}
                room={room}
                onDelete={handleDeleteRoom}
              />
            ))}
          </div>
        ) : (
          <div className="mt-12 p-10 text-center rounded bg-surface border border-hairline max-w-lg mx-auto flex flex-col items-center">
            <div className="w-12 h-12 rounded bg-recessed border border-hairline flex items-center justify-center text-secondary-token mb-4">
              <FolderOpen className="w-6 h-6" />
            </div>

            <h3 className="text-sm font-semibold text-primary-token mb-1 font-sans">
              {searchQuery ? 'No matching rooms found' : 'No Active Rooms Registered'}
            </h3>

            <p className="text-xs text-secondary-token max-w-sm mb-6 leading-relaxed">
              {searchQuery
                ? `No room matches query "${searchQuery}". Verify search term or clear the filter.`
                : 'Initialize your first casting room to generate a hardware-addressed pairing code and broadcast media.'}
            </p>

            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded btn-ref-secondary text-xs font-medium cursor-pointer"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded btn-ref-primary text-xs sm:text-sm font-medium cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Initialize First Room</span>
              </button>
            )}
          </div>
        )}
      </section>

      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onRoomCreated={handleRoomCreated}
      />
    </div>
  );
}
