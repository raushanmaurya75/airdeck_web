import React, { useState } from 'react';
import {
  Video,
  Link as LinkIcon,
  Upload,
  Play,
  Trash2,
  ExternalLink,
  Film,
  Sparkles,
  Presentation,
  ScreenShare,
  Layers,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

// Quick demo videos for immediate testing
const DEMO_PRESETS = [
  {
    title: 'Big Buck Bunny (4K Animation)',
    url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    type: 'youtube',
    source: 'preset',
  },
  {
    title: 'Cosmos Laundromat (Open Movie Project)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'direct',
    source: 'preset',
  },
  {
    title: 'Elephants Dream (Sci-Fi Animation)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    type: 'direct',
    source: 'preset',
  },
];

/**
 * Helper to extract YouTube video ID
 */
export function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=0&rel=0`;
  }
  return null;
}

export default function VideoPlayer({ video, onUpdateVideo, isCasting }) {
  const { success, warning, error: toastError } = useToast();
  const [urlInput, setUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState('url'); // 'url' | 'upload'
  const [inputError, setInputError] = useState('');

  // Future content types extension tab (visual only for phase 1)
  const [contentCategory, setContentCategory] = useState('video'); // 'video' | 'slides' | 'screen'

  const handleApplyUrl = (overrideUrl) => {
    const targetUrl = (overrideUrl || urlInput).trim();
    if (!targetUrl) {
      setInputError('Please enter a valid video link');
      return;
    }

    setInputError('');

    // Detect youtube or direct media
    const isYouTube = targetUrl.includes('youtube.com') || targetUrl.includes('youtu.be');
    const embedUrl = isYouTube ? getYouTubeEmbedUrl(targetUrl) : null;

    if (isYouTube && !embedUrl) {
      setInputError('Invalid YouTube URL format');
      return;
    }

    const newVideo = {
      type: isYouTube ? 'youtube' : 'url',
      url: targetUrl,
      embedUrl: embedUrl || targetUrl,
      title: isYouTube ? 'YouTube Streaming Source' : targetUrl.split('/').pop() || 'Web Video Stream',
      addedAt: new Date().toISOString(),
      source: 'web',
    };

    onUpdateVideo(newVideo);
    setUrlInput('');
    success('Video added', 'Video source loaded and synchronized.');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toastError('Invalid file', 'Please select a valid video file (.mp4, .webm, .mov, etc.)');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const newVideo = {
      type: 'local',
      url: objectUrl,
      embedUrl: objectUrl,
      title: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      addedAt: new Date().toISOString(),
      source: 'local_file',
    };

    onUpdateVideo(newVideo);
    success('Local video loaded', `Loaded "${file.name}" for casting.`);
  };

  const handleRemoveVideo = () => {
    if (isCasting) {
      warning('Active cast', 'Please stop casting before removing the current video source.');
      return;
    }
    onUpdateVideo(null);
    success('Video removed', 'The video source has been detached.');
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col">
      {/* Content Header & Future Formats Tab Switcher */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Media Player Stage</h3>
            <p className="text-xs text-slate-400">
              Select or stream media to connected devices
            </p>
          </div>
        </div>

        {/* Future Content Type Tabs (Extensible architecture placeholder) */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setContentCategory('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              contentCategory === 'video'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video</span>
          </button>

          {/* Placeholder for future PPT support */}
          {/* TODO: replace with real presentation/PPT casting in future phases */}
          <button
            type="button"
            onClick={() => {
              warning('Coming Soon', 'PPT / Slides casting is planned for Phase 2!');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-slate-500 hover:text-slate-300 transition-colors"
            title="Future phase: PPT / Keynote slides"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Slides / PPT</span>
            <span className="text-[9px] px-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Soon
            </span>
          </button>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800">
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
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 animate-pulse">
              <Play className="w-8 h-8 ml-1" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">
              No Video Source Loaded
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Paste a YouTube or MP4 video URL below, upload a local video file, or pick a demo sample to start casting.
            </p>
          </div>
        )}

        {/* Live Casting Overlay Watermark */}
        {video && isCasting && (
          <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-indigo-500/50 text-indigo-300 text-xs font-semibold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>BROADCASTING TO CONNECTED SCREENS</span>
          </div>
        )}
      </div>

      {/* Video Controls & Source Management */}
      <div className="p-4 sm:p-5 space-y-4">
        {video ? (
          /* Active video details card */
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                    {video.title || 'Video Stream'}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 uppercase font-mono">
                    {video.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-sm mt-0.5">
                  {video.url}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={handleRemoveVideo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
                title="Remove video source"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Change / Remove</span>
              </button>
            </div>
          </div>
        ) : (
          /* Source Add Options */
          <div className="space-y-4">
            {/* Tabs: URL vs Upload */}
            <div className="flex border-b border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`flex items-center gap-2 pb-2.5 font-medium border-b-2 transition-colors px-1 ${
                  activeTab === 'url'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Web / YouTube URL</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex items-center gap-2 pb-2.5 font-medium border-b-2 transition-colors px-4 ${
                  activeTab === 'upload'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Local File</span>
              </button>
            </div>

            {/* URL Input Tab */}
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
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyUrl()}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm transition-colors shrink-0"
                  >
                    Add Video
                  </button>
                </div>
                {inputError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {inputError}
                  </p>
                )}
              </div>
            )}

            {/* Local Upload Tab */}
            {activeTab === 'upload' && (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-xl bg-slate-950/40 hover:bg-slate-950/70 transition-colors cursor-pointer group">
                <Upload className="w-8 h-8 text-slate-400 group-hover:text-indigo-400 transition-colors mb-2" />
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                  Click to choose a video file from your computer
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  Supports MP4, WebM, MOV, MKV (Client preview URL)
                </span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}

            {/* Quick Demo Presets for Easy Evaluation */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Demo Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {DEMO_PRESETS.map((demo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyUrl(demo.url)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-indigo-300 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-400" />
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
