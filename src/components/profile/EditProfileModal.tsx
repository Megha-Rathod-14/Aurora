import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { X, Sparkles, Camera, Image as ImageIcon } from 'lucide-react';
import { Avatar } from '../common/Avatar';

export const EditProfileModal: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const { isEditProfileOpen, setIsEditProfileOpen, showToast } = useSocial();

  const [fullName, setFullName] = useState(currentUser.fullName);
  const [bio, setBio] = useState(currentUser.bio);
  const [website, setWebsite] = useState(currentUser.website || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [bannerUrl, setBannerUrl] = useState(currentUser.bannerUrl);

  if (!isEditProfileOpen) return null;

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      bio,
      website,
      location,
      avatarUrl,
      bannerUrl,
    });
    setIsEditProfileOpen(false);
    showToast('Profile updated successfully! ✨', 'neon');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 select-none">
      <div className="relative w-full max-w-xl bg-[#121218] border border-white/10 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto no-scrollbar animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00D9FF]" />
            <h3 className="text-lg font-bold text-white font-['Outfit']">Edit Aurora Identity</h3>
          </div>
          <button
            onClick={() => setIsEditProfileOpen(false)}
            className="p-1.5 rounded-full text-[#A0A0AA] hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
          {/* Cover & Avatar edit row */}
          <div className="relative">
            <div className="relative h-28 w-full rounded-2xl overflow-hidden bg-[#0B0B0F] border border-white/10">
              <img src={bannerUrl} alt="banner preview" className="w-full h-full object-cover" />
              <label className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center gap-2 text-xs font-bold text-white cursor-pointer transition-colors">
                <Camera className="w-4 h-4 text-[#00D9FF]" />
                Change Banner
                <input type="file" accept="image/*" onChange={handleBannerFile} className="hidden" />
              </label>
            </div>

            {/* Avatar overlay */}
            <div className="relative -mt-10 ml-4 inline-block">
              <Avatar src={avatarUrl} alt={fullName} size="xl" />
              <label className="absolute bottom-0 right-0 p-2 rounded-full bg-[#00D9FF] text-black cursor-pointer shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-3.5 h-3.5" />
                <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
              </label>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-[#A0A0AA] uppercase tracking-wider block mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0F] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00D9FF]"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-bold text-[#A0A0AA] uppercase tracking-wider block mb-1.5">
              Bio & Mission
            </label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              maxLength={200}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0F] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00D9FF] resize-none"
            />
            <span className="text-[10px] text-[#A0A0AA] float-right mt-1">{bio.length}/200</span>
          </div>

          {/* Website & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#A0A0AA] uppercase tracking-wider block mb-1.5">
                Website
              </label>
              <input
                type="text"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0F] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00D9FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#A0A0AA] uppercase tracking-wider block mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Tokyo, Berlin, SF..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#0B0B0F] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00D9FF]"
              />
            </div>
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#A0A0AA] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#287BFF] text-white text-xs font-bold shadow-[0_0_15px_rgba(0,217,255,0.4)] hover:scale-102 transition-transform"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

