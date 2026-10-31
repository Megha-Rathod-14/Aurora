import React from 'react';
import { Logo } from '../common/Logo';
import { useSocial } from '../../context/SocialContext';
import { Bell, Search, Sparkles } from 'lucide-react';

export const MobileHeader: React.FC = () => {
  const { setActiveTab, unreadNotificationsCount, triggerNeonCelebration } = useSocial();

  return (
    <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 select-none">
      <div onClick={() => setActiveTab('feed')} className="cursor-pointer">
        <Logo size="sm" showText={true} showTagline={false} />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={triggerNeonCelebration}
          className="p-2 rounded-xl bg-white/5 text-[#FFC83D] hover:bg-white/10 transition-colors"
          title="Neon Sparkle"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          className="p-2 rounded-xl bg-white/5 text-[#A0A0AA] hover:text-white hover:bg-white/10 transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className="relative p-2 rounded-xl bg-white/5 text-[#A0A0AA] hover:text-white hover:bg-white/10 transition-colors"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF258A] shadow-[0_0_6px_#FF258A]" />
          )}
        </button>
      </div>
    </header>
  );
};

