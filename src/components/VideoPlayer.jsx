import React, { useState } from 'react';
import {
  Film,
  Play,
  Upload,
  Link as LinkIcon,
  Trash2,
  AlertCircle,
  Video,
  Layers
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const DEMO_PRESETS = [
  {
    title: 'Commercial 4K Loop (Direct MP4)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'direct',
  },
  {
    title: 'Architectural Showreel (Direct MP4)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    type: 'direct',
  },
  {
    title: 'Demo Keynote Stream (YouTube)',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    type: 'youtube',
  },
];

export default function VideoPlayer({ video, onVideoChange, isCasting }) {
  const { success, error: toastError, warning } = useToast();
  const [activeTab, setActiveTab] = useState('url');
  const [urlInput, setUrlInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [contentCategory, setContentCategory] = useState('video');

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleApplyUrl = (customUrl = null) => {
    const targetUrl = (customUrl || urlInput).trim();
    if (!targetUrl) {
      setInputError('Please enter a valid video URL');
      return;
    }

    try {
      new URL(targetUrl);
    } catch {
      setInputError('Please enter a valid URL protocol (e.g. https://)');
      return;
    }

    setInputError('');

    const youtubeId = extractYouTubeId(targetUrl);
    let videoData;

    if (youtubeId) {
      videoData = {
        type: 'youtube',
        url: targetUrl,
        embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&enablejsapi=1`,
        title: 'YouTube Stream',
      };
    } else {
      videoData = {
        type: 'direct',
        url: targetUrl,
        embedUrl: targetUrl,
        title: targetUrl.split('/').pop() || 'Direct Video Stream',
      };
    }

    onVideoChange(videoData);
    setUrlInput('');
    success('Video loaded', `Stream configured: ${videoData.title}`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toastError('Invalid format', 'Please upload a valid MP4 or WebM video file');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const videoData = {
      type: 'local',
      url: objectUrl,
      embedUrl: objectUrl,
      title: file.name,
      filesize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    };

    onVideoChange(videoData);
    success('Local file loaded', `Loaded "${file.name}" for local playback`);
  };

  const handleRemoveVideo = () => {
    if (video?.type === 'local' && video.url) {
      URL.revokeObjectURL(video.url);
    }
    onVideoChange(null);
    success('Video removed', 'The video source has been detached.');
  };

  return (
    <div className="rounded bg-surface border border-hairline overflow-hidden flex flex-col">
      <div className="p-4 border-b border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-recessed/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#D4AF37] text-[#0A0A0B] flex items-center justify-center font-bold shadow-none">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-token text-sm sm:text-base font-sans">Media Viewport Stage</h3>
            <p className="text-xs text-secondary-token">
              Direct display preview and active broadcast source
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-surface rounded border border-hairline text-xs">
          <button
            type="button"
            onClick={() => setContentCategory('video')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
              contentCategory === 'video'
                ? 'bg-recessed text-primary-token'
                : 'text-secondary-token hover:text-primary-token'
            }`}
          >
            <Video className="w-3 h-3" />
            <span>Video</span>
          </button>

          <button
            type="button"
            onClick={() => {
              warning('Phase 2', 'Keynote & Slides broadcasting engine planned for Phase 2.');
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded font-medium text-muted-token hover:text-secondary-token transition-colors font-mono text-[11px] cursor-pointer"
          >
            <Layers className="w-3 h-3" />
            <span>Slides</span>
            <span className="text-[9px] px-1 rounded bg-recessed text-muted-token border border-hairline">
              Soon
            </span>
          </button>
        </div>
      </div>

      <div className="relative aspect-video w-full bg-[#000000] flex items-center justify-center overflow-hidden border-b border-hairline">
        {video ? (
          video.type === 'youtube' && video.embedUrl ? (
            <iframe
              src={video.embedUrl}
              title={video.title || 'AirDeck Cast Player'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <video
              src={video.url}
              controls
              playsInline
              className="w-full h-full object-contain bg-black"
            >
              Your browser does not support HTML5 video preview.
            </video>
          )
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
            <div className="w-12 h-12 rounded bg-recessed border border-hairline flex items-center justify-center text-secondary-token mb-3">
              <Play className="w-6 h-6 ml-0.5" />
            </div>
            <h4 className="text-sm font-semibold text-primary-token mb-1 font-sans">
              No Video Source Loaded
            </h4>
            <p className="text-xs text-secondary-token mb-4 leading-relaxed font-sans">
              Provide a streaming video URL or pick a direct preset to initiate synchronized casting.
            </p>
          </div>
        )}

        {video && isCasting && (
          <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2 px-2.5 py-1 rounded bg-[#0A0A0B]/90 border border-[#D4AF37]/50 text-[#F4F4F5] text-[11px] font-mono uppercase tracking-[0.16em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span>STREAMING TO CONNECTED SCREENS</span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {video ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded bg-recessed border border-hairline">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded bg-surface border border-hairline text-brand-accent flex items-center justify-center shrink-0">
                <Video className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-primary-token truncate max-w-xs sm:max-w-md font-sans">
                    {video.title || 'Video Stream'}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface text-secondary-token uppercase font-mono border border-hairline">
                    {video.type}
                  </span>
                </div>
                <p className="text-[11px] text-secondary-token truncate max-w-sm mt-0.5 font-mono">
                  {video.url}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer"
                title="Remove video source"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Detach Source</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex border-b border-hairline text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`flex items-center gap-2 pb-2.5 font-medium border-b-2 transition-colors px-1 cursor-pointer ${
                  activeTab === 'url'
                    ? 'border-brand-accent text-primary-token'
                    : 'border-transparent text-secondary-token hover:text-primary-token'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Web / Video URL</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex items-center gap-2 pb-2.5 font-medium border-b-2 transition-colors px-4 cursor-pointer ${
                  activeTab === 'upload'
                    ? 'border-brand-accent text-primary-token'
                    : 'border-transparent text-secondary-token hover:text-primary-token'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Local File</span>
              </button>
            </div>

            {activeTab === 'url' && (
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => {
                        setUrlInput(e.target.value);
                        setInputError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleApplyUrl();
                      }}
                      placeholder="Paste YouTube link or direct MP4/WebM URL..."
                      className="w-full px-3 py-2 rounded bg-recessed border border-hairline text-primary-token placeholder-muted-token text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37] dark:focus:border-[#D4AF37] light:focus:border-[#141413] transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyUrl()}
                    className="btn-ref-primary px-4 py-2 rounded text-xs sm:text-sm font-medium shrink-0 cursor-pointer"
                  >
                    Load Video
                  </button>
                </div>
                {inputError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1 font-mono">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {inputError}
                  </p>
                )}
              </div>
            )}

            {activeTab === 'upload' && (
              <label className="flex flex-col items-center justify-center p-6 border border-dashed border-hairline hover:border-hover rounded bg-recessed/60 transition-colors cursor-pointer group">
                <Upload className="w-6 h-6 text-secondary-token group-hover:text-primary-token transition-colors mb-2" />
                <span className="text-xs font-semibold text-secondary-token group-hover:text-primary-token font-sans">
                  Select a local media file for offline preview
                </span>
                <span className="text-[11px] text-muted-token mt-1 font-mono">
                  Supported formats: MP4, WebM, MOV, MKV
                </span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}

            <div className="pt-2">
              <span className="text-[10px] font-mono font-medium text-muted-token uppercase tracking-[0.16em] block mb-2">
                VERIFIED MEDIA PRESETS:
              </span>
              <div className="flex flex-wrap gap-2">
                {DEMO_PRESETS.map((demo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyUrl(demo.url)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-recessed border border-hairline hover:border-hover text-xs font-mono text-secondary-token hover:text-primary-token transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 text-brand-accent" />
                    <span>{demo.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
