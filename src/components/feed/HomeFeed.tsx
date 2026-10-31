import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { useAuth } from '../../context/AuthContext';
import { StoriesBar } from '../stories/StoriesBar';
import { PostCard } from './PostCard';
import { Avatar } from '../common/Avatar';
import { Sparkles, Flame, Users, Image as ImageIcon, Video, CheckCircle2 } from 'lucide-react';

export const HomeFeed: React.FC = () => {
  const { posts, setIsCreatePostOpen } = useSocial();
  const { currentUser } = useAuth();

  const [feedFilter, setFeedFilter] = useState<'for_you' | 'following' | 'trending'>('for_you');

  // Filter posts based on selected tab
  const filteredPosts = posts.filter(post => {
    if (feedFilter === 'following') {
      return post.user.isFollowing || post.userId === currentUser.id;
    }
    if (feedFilter === 'trending') {
      return post.likesCount > 2000;
    }
    return true; // for_you
  });

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-3 sm:px-4">
      {/* 1. Stories Carousel Bar at top */}
      <StoriesBar />

      {/* 2. Quick Create Bar */}
      <div className="w-full bg-[#121218] border border-white/5 rounded-3xl p-4 mb-6 shadow-lg flex items-center gap-3">
        <Avatar src={currentUser.avatarUrl} alt={currentUser.fullName} size="sm" isOnline={true} />
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="flex-1 text-left px-4 py-2.5 rounded-2xl bg-[#0B0B0F] border border-white/10 text-xs sm:text-sm text-[#A0A0AA] hover:text-white hover:border-[#00D9FF]/40 transition-all cursor-pointer truncate"
        >
          What are you inspiring today, {currentUser.fullName.split(' ')[0]}? ✨
        </button>
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="p-2.5 rounded-xl bg-white/5 text-[#00D9FF] hover:bg-[#00D9FF]/10 transition-colors"
          title="Upload photo"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="p-2.5 rounded-xl bg-white/5 text-[#FF258A] hover:bg-[#FF258A]/10 transition-colors"
          title="Upload video"
        >
          <Video className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Feed Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-3">
        <button
          onClick={() => setFeedFilter('for_you')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            feedFilter === 'for_you'
              ? 'bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/30 shadow-[0_0_12px_rgba(0,217,255,0.2)]'
              : 'text-[#A0A0AA] hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          For You
        </button>

        <button
          onClick={() => setFeedFilter('following')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            feedFilter === 'following'
              ? 'bg-[#9B59FF]/15 text-[#9B59FF] border border-[#9B59FF]/30 shadow-[0_0_12px_rgba(155,89,255,0.2)]'
              : 'text-[#A0A0AA] hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Following
        </button>

        <button
          onClick={() => setFeedFilter('trending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            feedFilter === 'trending'
              ? 'bg-[#FF258A]/15 text-[#FF258A] border border-[#FF258A]/30 shadow-[0_0_12px_rgba(255,37,138,0.2)]'
              : 'text-[#A0A0AA] hover:text-white hover:bg-white/5'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          Trending
        </button>
      </div>

      {/* 4. Posts Feed */}
      <div className="flex flex-col gap-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-[#121218] rounded-3xl border border-white/5 p-8">
            <Sparkles className="w-10 h-10 text-[#00D9FF] mx-auto mb-3 animate-spin-slow" />
            <h3 className="text-base font-bold text-white">No posts found in this view</h3>
            <p className="text-xs text-[#A0A0AA] mt-1 max-w-sm mx-auto">
              Follow more creators or switch back to the 'For You' stream to see curated Aurora inspirations.
            </p>
          </div>
        ) : (
          filteredPosts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {/* 5. Infinite Scroll Completed Marker */}
      <div className="flex flex-col items-center justify-center py-12 text-center text-[#A0A0AA] gap-2 select-none">
        <div className="p-3 rounded-full bg-gradient-to-tr from-[#00D9FF]/20 to-[#FF258A]/20 border border-[#00D9FF]/30 shadow-[0_0_15px_rgba(0,217,255,0.2)]">
          <CheckCircle2 className="w-6 h-6 text-[#00D9FF]" />
        </div>
        <p className="text-sm font-bold text-white mt-1">You're All Caught Up!</p>
        <p className="text-xs text-[#A0A0AA] max-w-xs">
          You've explored all recent transmissions on Aurora. Connect, create, and inspire!
        </p>
      </div>
    </div>
  );
};

