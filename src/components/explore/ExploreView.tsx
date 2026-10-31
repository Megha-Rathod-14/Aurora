import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { EXPLORE_GRID_ITEMS, DEMO_USERS, TRENDING_HASHTAGS } from '../../data/mockData';
import { Search, Heart, MessageCircle, Sparkles, Flame, User, Hash } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { Post } from '../../types';

export const ExploreView: React.FC = () => {
  const { setSelectedPostDetail, posts, setActiveProfileId, setActiveTab } = useSocial();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [exploreQuery, setExploreQuery] = useState<string>('');

  const categories = ['All', 'Cyberpunk', '3D Art', 'Fashion', 'Music', 'Photography', 'Architecture'];

  // Filter items
  const filteredItems = EXPLORE_GRID_ITEMS.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesQuery =
      !exploreQuery.trim() ||
      item.caption.toLowerCase().includes(exploreQuery.toLowerCase()) ||
      item.user.username.toLowerCase().includes(exploreQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(exploreQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Filter creators for the search preview
  const matchedUsers = DEMO_USERS.filter(
    u =>
      exploreQuery.trim() &&
      (u.fullName.toLowerCase().includes(exploreQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(exploreQuery.toLowerCase()))
  );

  const handleCardClick = (item: (typeof EXPLORE_GRID_ITEMS)[0]) => {
    // Check if matching post exists or create a transient Post object
    const existing = posts.find(p => p.mediaUrls.includes(item.imageUrl));
    if (existing) {
      setSelectedPostDetail(existing);
    } else {
      const mockPost: Post = {
        id: item.id,
        userId: item.user.id,
        user: item.user,
        mediaUrls: [item.imageUrl],
        mediaType: 'image',
        caption: item.caption,
        hashtags: [`#${item.category}`, '#AuroraExplore', '#CreativeInspire'],
        likesCount: item.likesCount,
        commentsCount: item.commentsCount,
        sharesCount: 140,
        savesCount: 320,
        isLiked: false,
        isSaved: false,
        createdAt: '1 day ago',
        comments: [
          {
            id: 'c_exp_1',
            postId: item.id,
            userId: 'usr_me',
            user: item.user,
            content: 'Incredible atmosphere and vibrant composition! ⚡',
            likesCount: 15,
            isLiked: false,
            createdAt: '3 hours ago',
          }
        ]
      };
      setSelectedPostDetail(mockPost);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 select-none">
      {/* 1. Explore Search Bar */}
      <div className="relative mb-6">
        <Search className="w-5 h-5 text-[#A0A0AA] absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={exploreQuery}
          onChange={e => setExploreQuery(e.target.value)}
          placeholder="Search creators, aesthetics (#cyberpunk, #neon), or visual styles..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#121218] border border-white/10 text-sm text-white placeholder-[#A0A0AA] focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] transition-all shadow-lg"
        />
        {exploreQuery && (
          <button
            onClick={() => setExploreQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#A0A0AA] hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Matching creators if searching */}
      {matchedUsers.length > 0 && (
        <div className="mb-6 p-4 rounded-3xl bg-[#121218] border border-white/10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00D9FF] mb-3 block flex items-center gap-1.5">
            <User className="w-4 h-4" />
            Matching Creators
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {matchedUsers.map(user => (
              <div
                key={user.id}
                onClick={() => {
                  setActiveProfileId(user.id);
                  setActiveTab('profile');
                }}
                className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#0B0B0F] border border-white/5 hover:border-[#00D9FF]/40 cursor-pointer transition-all group"
              >
                <Avatar src={user.avatarUrl} alt={user.fullName} size="sm" isVerified={user.isVerified} />
                <div className="truncate">
                  <p className="text-xs font-bold text-white group-hover:text-[#00D9FF] transition-colors truncate">
                    {user.fullName}
                  </p>
                  <p className="text-[11px] text-[#A0A0AA] truncate">@{user.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all shrink-0 ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-[#00D9FF] to-[#9B59FF] text-white shadow-[0_0_15px_rgba(0,217,255,0.4)] scale-105'
                : 'bg-[#121218] text-[#A0A0AA] hover:text-white hover:bg-white/5 border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Pinterest / Masonry Explore Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            className={`relative group rounded-3xl overflow-hidden cursor-pointer bg-[#121218] border border-white/5 hover:border-[#00D9FF]/40 transition-all duration-300 shadow-lg ${
              item.isSpan2 ? 'row-span-2 aspect-[9/16]' : 'aspect-square'
            }`}
          >
            <img
              src={item.imageUrl}
              alt={item.caption}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              loading="lazy"
            />

            {/* Neon Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-10">
              <div className="flex justify-end">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-[#00D9FF] shadow-[0_0_10px_#00D9FF]">
                  {item.category}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-white line-clamp-2 leading-snug mb-2">
                  {item.caption}
                </p>

                <div className="flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-1.5">
                    <Avatar src={item.user.avatarUrl} alt={item.user.fullName} size="xs" />
                    <span className="text-[11px] font-semibold text-white/90 truncate max-w-[80px]">
                      {item.user.username}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] text-[#FF258A]">
                      <Heart className="w-3.5 h-3.5 fill-[#FF258A]" />
                      {(item.likesCount / 1000).toFixed(1)}k
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-white">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {item.commentsCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

