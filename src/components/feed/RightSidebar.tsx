import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { Avatar } from '../common/Avatar';
import { TRENDING_HASHTAGS, DEMO_USERS } from '../../data/mockData';
import { Sparkles, TrendingUp, UserPlus, Check, ArrowUpRight } from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const { currentUser, switchDemoUser } = useAuth();
  const { toggleFollowUser, setActiveProfileId, setActiveTab } = useSocial();

  // Filter suggested users (not current user)
  const suggestedUsers = DEMO_USERS.filter(u => u.id !== currentUser.id).slice(0, 4);

  const handleUserClick = (userId: string) => {
    setActiveProfileId(userId);
    setActiveTab('profile');
  };

  return (
    <aside className="hidden xl:flex flex-col gap-6 w-80 h-screen sticky top-0 py-6 px-4 border-l border-white/5 select-none overflow-y-auto no-scrollbar">
      {/* 1. Current User Mini Card */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#121218] border border-white/5 shadow-lg">
        <div
          onClick={() => handleUserClick(currentUser.id)}
          className="flex items-center gap-3 cursor-pointer group overflow-hidden"
        >
          <Avatar
            src={currentUser.avatarUrl}
            alt={currentUser.fullName}
            size="md"
            isOnline={true}
            isVerified={currentUser.isVerified}
          />
          <div className="truncate">
            <p className="text-xs font-bold text-white group-hover:text-[#00D9FF] transition-colors truncate">
              {currentUser.fullName}
            </p>
            <p className="text-[11px] text-[#A0A0AA] truncate">@{currentUser.username}</p>
          </div>
        </div>

        <button
          onClick={() => {
            const others = DEMO_USERS.filter(u => u.id !== currentUser.id);
            if (others.length > 0) switchDemoUser(others[0].id);
          }}
          className="text-xs font-bold text-[#00D9FF] hover:text-[#FF258A] transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
        >
          Switch
        </button>
      </div>

      {/* 2. Suggested Creators */}
      <div className="p-4 rounded-3xl bg-[#121218]/80 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#00D9FF]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Suggested For You</h4>
          </div>
          <span className="text-[10px] text-[#A0A0AA] font-mono">Curated</span>
        </div>

        <div className="flex flex-col gap-3.5">
          {suggestedUsers.map(user => (
            <div key={user.id} className="flex items-center justify-between gap-2">
              <div
                onClick={() => handleUserClick(user.id)}
                className="flex items-center gap-2.5 cursor-pointer group overflow-hidden"
              >
                <Avatar
                  src={user.avatarUrl}
                  alt={user.fullName}
                  size="sm"
                  isVerified={user.isVerified}
                  isOnline={user.isOnline}
                />
                <div className="truncate">
                  <p className="text-xs font-semibold text-white group-hover:text-[#00D9FF] transition-colors truncate">
                    {user.fullName}
                  </p>
                  <p className="text-[10px] text-[#A0A0AA] truncate">
                    {user.followersCount.toLocaleString()} followers
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleFollowUser(user.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  user.isFollowing
                    ? 'bg-white/5 text-[#A0A0AA] hover:text-white border border-white/10'
                    : 'bg-gradient-to-r from-[#00D9FF] to-[#287BFF] text-white shadow-[0_0_12px_rgba(0,217,255,0.3)] hover:scale-105'
                }`}
              >
                {user.isFollowing ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Following
                  </span>
                ) : (
                  'Follow'
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Trending Hashtags */}
      <div className="p-4 rounded-3xl bg-[#121218]/80 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#FF258A]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Trending on Aurora</h4>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-[#FFC83D]" />
        </div>

        <div className="flex flex-col gap-3">
          {TRENDING_HASHTAGS.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setActiveTab('explore')}
              className="flex items-center justify-between group cursor-pointer p-1.5 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div>
                <span className="text-[10px] text-[#A0A0AA] uppercase tracking-wider block">
                  {item.category}
                </span>
                <p className="text-xs font-bold text-white group-hover:text-[#00D9FF] transition-colors">
                  {item.tag}
                </p>
                <span className="text-[10px] text-[#A0A0AA]">{item.postsCount}</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#A0A0AA] group-hover:text-[#00D9FF] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Footer & Hummingbird Sign-off */}
      <footer className="text-[11px] text-[#A0A0AA] px-2 flex flex-col gap-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span className="hover:text-white cursor-pointer transition-colors">About</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer transition-colors">Help</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer transition-colors">API</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
        </div>
        <p className="text-[10px] text-[#A0A0AA]/60">
          © 2026 AURORA PLATFORM. CONNECT. CREATE. INSPIRE.
        </p>
      </footer>
    </aside>
  );
};

