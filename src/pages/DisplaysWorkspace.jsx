import React, { useState, useEffect } from 'react';
import { Tv, Plus, Search } from 'lucide-react';
import DisplayCard from '../components/DisplayCard';
import PairDisplayModal from '../components/PairDisplayModal';
import { getDisplays, deleteDisplay } from '../services/storageService';
import { useToast } from '../context/ToastContext';

export default function DisplaysWorkspace({ isPairModalOpen, setIsPairModalOpen }) {
  const { success } = useToast();
  const [displays, setDisplays] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshDisplays = () => {
    const loaded = getDisplays();
    setDisplays(loaded);
  };

  useEffect(() => {
    refreshDisplays();
  }, []);

  const handleDeleteDisplay = (id) => {
    deleteDisplay(id);
    success('Display Unpaired', 'Screen disconnected from studio console.');
    refreshDisplays();
  };

  const handleDisplayPaired = () => {
    refreshDisplays();
  };

  const filteredDisplays = displays.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.pairingCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-page text-primary-token pb-16 transition-colors font-sans">
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary-token font-sans">
              Commercial Displays
            </h1>
            <p className="mt-1 text-xs text-secondary-token font-sans">
              Bind Android TV endpoints using their on-screen 6-character pairing code.
            </p>
          </div>

          <button
            onClick={() => setIsPairModalOpen(true)}
            className="btn-ref-primary flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium shrink-0 self-start sm:self-center cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Pair New Display</span>
          </button>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        {displays.length === 0 ? (
          <div className="my-10 max-w-xl mx-auto p-12 sm:p-14 rounded bg-surface border border-hairline text-center flex flex-col items-center">
            <Tv className="w-10 h-10 text-brand-accent mb-4" />

            <h3 className="text-base font-bold text-primary-token tracking-tight font-sans mb-1.5">
              No Commercial Displays Paired
            </h3>

            <p className="text-xs text-secondary-token max-w-sm mb-6 leading-relaxed font-sans">
              Pair your first Android TV endpoint using its on-screen 6-character code or initialize a new broadcast room.
            </p>

            <button
              onClick={() => setIsPairModalOpen(true)}
              className="btn-ref-primary flex items-center justify-center gap-1.5 px-5 py-2.5 rounded text-xs sm:text-sm font-medium cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Pair New Display</span>
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-secondary-token">
                {displays.length} Registered Screen Endpoints
              </span>

              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-secondary-token absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter displays..."
                  className="w-full pl-9 pr-3 py-1.5 rounded bg-surface border border-hairline text-primary-token placeholder-secondary-token text-xs focus:outline-none focus:border-[#D4AF37] dark:focus:border-[#D4AF37] light:focus:border-[#141413] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDisplays.map((display) => (
                <DisplayCard
                  key={display.id}
                  display={display}
                  onDelete={handleDeleteDisplay}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <PairDisplayModal
        isOpen={isPairModalOpen}
        onClose={() => setIsPairModalOpen(false)}
        onDisplayPaired={handleDisplayPaired}
      />
    </div>
  );
}
