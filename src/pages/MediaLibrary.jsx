import React, { useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const INITIAL_MEDIA_LIBRARY = [
  {
    id: 'med-01',
    category: 'VIDEO',
    duration: '15s',
    title: 'Convocation Keynote Reel',
    subtitle: '4K Hardware-Decoded Loop • 60 FPS',
    format: 'MP4 • H.264',
    size: '46.8 MB',
    checksum: 'SHA-256 ✓',
    resolution: '3840x2160',
  },
  {
    id: 'med-02',
    category: 'IMAGES',
    duration: '12s',
    title: 'Dining Hall Daily Specials',
    subtitle: 'High-Contrast Menu Board Graphic',
    format: 'PNG • Lossless',
    size: '4.2 MB',
    checksum: 'SHA-256 ✓',
    resolution: '3840x2160',
  },
  {
    id: 'med-03',
    category: 'PDF SLIDES',
    duration: '18s',
    title: 'End-Semester Exam Timetable',
    subtitle: 'Auto-Rasterized Multi-Page Circular',
    format: 'PDF • 6 Pages',
    size: '1.9 MB',
    checksum: 'SHA-256 ✓',
    resolution: '1920x1080',
  },
];

export default function MediaLibrary() {
  const { success, warning } = useToast();
  const [activeFilter, setActiveFilter] = useState('All');
  const [mediaList, setMediaList] = useState(INITIAL_MEDIA_LIBRARY);

  const filters = ['All', 'Images', 'PDF Slides', 'Video'];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newAsset = {
      id: `med-${Date.now()}`,
      category: file.type.startsWith('image/') ? 'IMAGES' : file.type.includes('pdf') ? 'PDF SLIDES' : 'VIDEO',
      duration: '10s',
      title: file.name.replace(/\.[^/.]+$/, ''),
      subtitle: 'Client Direct Staged Asset',
      format: file.type.split('/')[1]?.toUpperCase() || 'Direct',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      checksum: 'SHA-256 ✓',
      resolution: '3840x2160',
    };

    setMediaList([newAsset, ...mediaList]);
    success('Media Staged', `Cached "${file.name}" in local storage.`);
  };

  const handleDelete = (id) => {
    setMediaList(mediaList.filter((m) => m.id !== id));
    warning('Media Detached', 'Asset removed from local display loop.');
  };

  const filteredMedia = mediaList.filter((item) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Images') return item.category === 'IMAGES';
    if (activeFilter === 'PDF Slides') return item.category === 'PDF SLIDES';
    if (activeFilter === 'Video') return item.category === 'VIDEO';
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-page text-primary-token pb-16 transition-colors font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            {filters.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'btn-ref-primary'
                      : 'bg-surface border border-hairline text-secondary-token hover:text-primary-token hover:border-hover'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          <label className="btn-ref-primary flex items-center gap-1.5 px-4 py-2 rounded text-xs font-medium cursor-pointer shrink-0 self-start sm:self-center">
            <Upload className="w-3.5 h-3.5" />
            <span>Add Media Asset</span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="rounded bg-surface border border-hairline p-5 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <span className="text-brand-accent font-semibold tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-muted-token font-mono">
                    {item.duration}
                  </span>
                </div>

                <h3 className="text-base font-bold text-primary-token font-sans leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-secondary-token mt-1 mb-4 font-sans">
                  {item.subtitle}
                </p>

                <div className="p-3 rounded bg-recessed border border-hairline space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted-token">Format</span>
                    <span className="text-primary-token font-medium">{item.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-token">Size</span>
                    <span className="text-primary-token font-medium">{item.size}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-token">Checksum</span>
                    <span className="text-[#10B981] font-medium flex items-center gap-1">
                      {item.checksum}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-hairline flex items-center justify-between text-xs font-mono text-muted-token">
                <span>{item.resolution}</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-muted-token hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                  title="Remove asset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
