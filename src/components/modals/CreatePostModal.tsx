import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import {
  X,
  Upload,
  Image as ImageIcon,
  MapPin,
  Hash,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';

export const CreatePostModal: React.FC = () => {
  const { isCreatePostOpen, setIsCreatePostOpen, createPost } = useSocial();
  const { currentUser } = useAuth();

  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [hashtags, setHashtags] = useState<string[]>(['#AuroraCreators']);
  const [currentTagInput, setCurrentTagInput] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'portrait' | 'square' | 'landscape'>('portrait');
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // Upload simulation state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isCreatePostOpen) return null;

  const quickTags = ['#Cyberpunk', '#NeonAesthetics', '#AuroraPulse', '#3DArt', '#DigitalFuture', '#MetaverseStyle'];

  const sampleImages = [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaUrls(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeMedia = (index: number) => {
    setMediaUrls(prev => prev.filter((_, i) => i !== index));
    if (activeMediaIndex >= mediaUrls.length - 1) {
      setActiveMediaIndex(Math.max(0, mediaUrls.length - 2));
    }
  };

  const handleAddTag = (tag: string) => {
    const formatted = tag.startsWith('#') ? tag : `#${tag}`;
    if (!hashtags.includes(formatted)) {
      setHashtags(prev => [...prev, formatted]);
    }
    setCurrentTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setHashtags(prev => prev.filter(t => t !== tagToRemove));
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (mediaUrls.length === 0) return;

    setIsUploading(true);
    let prog = 10;
    const interval = setInterval(() => {
      prog += 20;
      setUploadProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          createPost({
            mediaUrls,
            mediaType: mediaUrls.length > 1 ? 'carousel' : 'image',
            caption,
            hashtags,
            location: location || undefined,
            aspectRatio,
          });
          setIsUploading(false);
          setMediaUrls([]);
          setCaption('');
          setLocation('');
        }, 300);
      }
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-3 sm:p-6 select-none">
      <div className="relative w-full max-w-4xl bg-[#121218] border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh] animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0B0B0F]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00D9FF]" />
            <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
              Create New Aurora Post
            </h3>
          </div>
          <button
            onClick={() => setIsCreatePostOpen(false)}
            className="p-1.5 rounded-full text-[#A0A0AA] hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Left Media Preview, Right Details */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-y-auto no-scrollbar">
          {/* ============================================================== */}
          {/* LEFT: MEDIA UPLOADER & PREVIEW (7 Cols) */}
          {/* ============================================================== */}
          <div className="md:col-span-7 p-5 bg-[#050505] flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
            {mediaUrls.length === 0 ? (
              <div className="h-72 sm:h-96 w-full border-2 border-dashed border-white/15 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                <div className="p-4 rounded-full bg-white/5 text-[#00D9FF] mb-3">
                  <Upload className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Drag photos or videos here</h4>
                <p className="text-xs text-[#A0A0AA] mb-4">Supports multi-photo carousels, PNG, JPG, WebP</p>

                <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#287BFF] text-white text-xs font-bold cursor-pointer hover:scale-105 transition-transform shadow-lg">
                  Select From Computer
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Sample Presets */}
                <div className="mt-6 pt-4 border-t border-white/5 w-full">
                  <span className="text-[11px] text-[#A0A0AA] block mb-2 font-medium">Or quick pick sample media:</span>
                  <div className="grid grid-cols-4 gap-2">
                    {sampleImages.map((src, idx) => (
                      <div
                        key={idx}
                        onClick={() => setMediaUrls(prev => [...prev, src])}
                        className="aspect-square rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-[#00D9FF] transition-all"
                      >
                        <img src={src} alt="preset" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Active Media Frame */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center">
                  <img
                    src={mediaUrls[activeMediaIndex]}
                    alt="active media"
                    className="w-full h-full object-cover"
                  />

                  {/* Remove Button */}
                  <button
                    onClick={() => removeMedia(activeMediaIndex)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-[#FF258A] transition-colors"
                    title="Remove media"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Carousel navigation */}
                  {mediaUrls.length > 1 && (
                    <>
                      {activeMediaIndex > 0 && (
                        <button
                          onClick={() => setActiveMediaIndex(prev => prev - 1)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      )}
                      {activeMediaIndex < mediaUrls.length - 1 && (
                        <button
                          onClick={() => setActiveMediaIndex(prev => prev + 1)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Thumbnails strip & Add more button */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {mediaUrls.map((url, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveMediaIndex(i)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 cursor-pointer border-2 transition-all ${
                        activeMediaIndex === i ? 'border-[#00D9FF] scale-105' : 'border-transparent opacity-60'
                      }`}
                    >
                      <img src={url} alt="thumb" className="w-full h-full object-cover" />
                    </div>
                  ))}

                  <label className="w-14 h-14 rounded-xl border border-dashed border-white/20 hover:border-[#00D9FF] flex items-center justify-center cursor-pointer shrink-0 transition-colors">
                    <Upload className="w-4 h-4 text-[#A0A0AA]" />
                    <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            )}

            {/* Aspect Ratio Selector */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-3 text-xs">
              <span className="text-[#A0A0AA] flex items-center gap-1.5 font-medium">
                <Maximize2 className="w-3.5 h-3.5 text-[#00D9FF]" />
                Format Aspect Ratio:
              </span>
              <div className="flex items-center gap-1">
                {(['portrait', 'square', 'landscape'] as const).map(ratio => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-2.5 py-1 rounded-lg capitalize text-xs font-semibold transition-all ${
                      aspectRatio === ratio
                        ? 'bg-white/20 text-[#00D9FF] border border-[#00D9FF]/40'
                        : 'text-[#A0A0AA] hover:text-white'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* RIGHT: CAPTION, HASHTAGS, LOCATION & PUBLISH (5 Cols) */}
          {/* ============================================================== */}
          <div className="md:col-span-5 p-5 flex flex-col justify-between bg-[#121218]">
            <div className="flex flex-col gap-4">
              {/* Creator info */}
              <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                <Avatar src={currentUser.avatarUrl} alt={currentUser.fullName} size="sm" isVerified={currentUser.isVerified} />
                <div>
                  <p className="text-xs font-bold text-white">{currentUser.fullName}</p>
                  <p className="text-[10px] text-[#A0A0AA]">Posting to Public Aurora Feed</p>
                </div>
              </div>

              {/* Caption Input */}
              <div>
                <label className="text-xs font-bold text-[#A0A0AA] uppercase tracking-wider block mb-1.5">
                  Caption & Narrative
                </label>
                <textarea
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="Share the story behind this visual inspiration..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0B0F] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00D9FF] resize-none leading-relaxed"
                />
                <span className="text-[10px] text-[#A0A0AA] float-right mt-0.5">{caption.length}/500</span>
              </div>

              {/* Location Input */}
              <div>
                <label className="text-xs font-bold text-[#A0A0AA] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00D9FF]" />
                  Add Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Shibuya Crossing, Tokyo or Meta Studio"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0B0F] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00D9FF]"
                />
              </div>

              {/* Hashtags Input & Suggestions */}
              <div>
                <label className="text-xs font-bold text-[#A0A0AA] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-[#FF258A]" />
                  Tags & Aesthetics
                </label>
                <div className="flex gap-1.5 mb-2">
                  <input
                    type="text"
                    value={currentTagInput}
                    onChange={e => setCurrentTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (currentTagInput.trim()) handleAddTag(currentTagInput);
                      }
                    }}
                    placeholder="Type tag and press enter..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#0B0B0F] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00D9FF]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (currentTagInput.trim()) handleAddTag(currentTagInput);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold text-white hover:bg-white/20"
                  >
                    Add
                  </button>
                </div>

                {/* Selected tags */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {hashtags.map(t => (
                    <span
                      key={t}
                      onClick={() => handleRemoveTag(t)}
                      className="px-2.5 py-0.5 rounded-lg bg-[#00D9FF]/15 text-[#00D9FF] text-[11px] font-semibold flex items-center gap-1 cursor-pointer hover:bg-[#FF258A]/20 hover:text-[#FF258A] transition-colors"
                    >
                      {t}
                      <X className="w-3 h-3" />
                    </span>
                  ))}
                </div>

                {/* Quick suggestions */}
                <div className="flex flex-wrap gap-1">
                  {quickTags.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleAddTag(t)}
                      className="text-[10px] text-[#A0A0AA] hover:text-[#00D9FF] bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-md transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Progress & Publish Button */}
            <div className="pt-4 border-t border-white/10 mt-4">
              {isUploading && (
                <div className="mb-3">
                  <div className="flex justify-between text-[11px] text-[#A0A0AA] mb-1">
                    <span>Broadcasting transmission to Aurora...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00D9FF] via-[#9B59FF] to-[#FF258A] transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handlePublish}
                disabled={mediaUrls.length === 0 || isUploading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#00D9FF] via-[#287BFF] to-[#FF258A] text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(0,217,255,0.4)] hover:shadow-[0_0_30px_rgba(255,37,138,0.5)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {isUploading ? 'Publishing...' : 'Publish Transmission ✨'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

