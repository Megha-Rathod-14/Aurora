import React from 'react';
import { useSocial } from '../../context/SocialContext';
import { useAuth } from '../../context/AuthContext';
import { Home, Compass, Film, MessageSquare, Plus, User } from 'lucide-react';
import { ActiveTab } from '../../types';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, conversations, setIsCreatePostOpen, setActiveProfileId } = useSocial();
  const { currentUser } = useAuth();

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const handleProfileClick = () => {
    setActiveProfileId(currentUser.id);
    setActiveTab('profile');
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 py-2 bg-[#0B0B0F]/90 backdrop-blur-2xl border-t border-white/10 select-none pb-safe">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* Home */}
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            activeTab === 'feed' ? 'text-[#00D9FF]' : 'text-[#A0A0AA]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </button>

        {/* Explore */}
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            activeTab === 'explore' ? 'text-[#00D9FF]' : 'text-[#A0A0AA]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Explore</span>
        </button>

        {/* Create Post (+) Button */}
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="relative -top-3 p-3.5 rounded-full bg-gradient-to-tr from-[#00D9FF] via-[#9B59FF] to-[#FF258A] text-white shadow-[0_0_20px_rgba(0,217,255,0.5)] active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Reels */}
        <button
          onClick={() => setActiveTab('reels')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            activeTab === 'reels' ? 'text-[#00D9FF]' : 'text-[#A0A0AA]'
          }`}
        >
          <Film className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Reels</span>
        </button>

        {/* Messages */}
        <button
          onClick={() => setActiveTab('messages')}
          className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            activeTab === 'messages' ? 'text-[#00D9FF]' : 'text-[#A0A0AA]'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          {totalUnread > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FF258A] shadow-[0_0_6px_#FF258A]" />
          )}
          <span className="text-[10px] mt-1 font-medium">Chat</span>
        </button>

        {/* Profile */}
        <button
          onClick={handleProfileClick}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            activeTab === 'profile' ? 'text-[#00D9FF]' : 'text-[#A0A0AA]'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
};

