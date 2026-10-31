import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { X, Upload, Sparkles, Image as ImageIcon } from 'lucide-react';

export const CreateStoryModal: React.FC = () => {
  const { isCreateStoryOpen, setIsCreateStoryOpen, createStory } = useSocial();
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [previewError, setPreviewError] = useState(false);

  if (!isCreateStoryOpen) return null;

  const samplePresets = [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result as string);
        setPreviewError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl) return;
    createStory(mediaUrl, 'image', caption);
    setMediaUrl('');
    setCaption('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 select-none">
      <div className="relative w-full max-w-lg bg-[#121218] border border-white/10 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,217,255,0.25)] animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00D9FF]" />
            <h3 className="text-lg font-bold text-white font-['Outfit']">Add to Aurora Story</h3>
          </div>
          <button
            onClick={() => setIsCreateStoryOpen(false)}
            className="p-1.5 rounded-full text-[#A0A0AA] hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          {/* Media Preview or Upload Area */}
          <div className="relative aspect-[9/12] max-h-72 w-full rounded-2xl overflow-hidden bg-[#0B0B0F] border border-dashed border-white/15 flex flex-col items-center justify-center">
            {mediaUrl && !previewError ? (
              <img
                src={mediaUrl}
                alt="Story preview"
                onError={() => setPreviewError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 cursor-pointer p-6 text-center group">
                <div className="p-4 rounded-full bg-white/5 group-hover:bg-[#00D9FF]/20 text-[#00D9FF] transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-white">Upload image from device</span>
                <span className="text-xs text-[#A0A0AA]">PNG, JPG, WebP supported</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}

            {mediaUrl && (
              <button
                type="button"
                onClick={() => setMediaUrl('')}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Preset Selector */}
          <div>
            <label className="text-xs font-semibold text-[#A0A0AA] mb-2 block flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#9B59FF]" />
              Or pick an aesthetic Aurora visual:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {samplePresets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setMediaUrl(preset);
                    setPreviewError(false);
                  }}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    mediaUrl === preset ? 'border-[#00D9FF] scale-102 shadow-[0_0_12px_#00D9FF]' : 'border-transparent hover:opacity-80'
                  }`}
                >
                  <img src={preset} alt="preset" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Caption */}
          <div>
            <input
              type="text"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Add a story caption (optional)..."
              maxLength={120}
              className="w-full px-4 py-3 rounded-xl bg-[#0B0B0F] border border-white/10 text-white placeholder-[#A0A0AA] text-sm focus:outline-none focus:border-[#00D9FF] transition-all"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!mediaUrl}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#00D9FF] via-[#9B59FF] to-[#FF258A] text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(0,217,255,0.3)] hover:shadow-[0_0_30px_rgba(255,37,138,0.5)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Share to Aurora Story Ring 💫
          </button>
        </form>
      </div>
    </div>
  );
};

