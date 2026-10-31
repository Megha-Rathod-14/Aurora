import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import { DEMO_USERS } from '../../data/mockData';
import {
  Grid,
  Film,
  Bookmark,
  Tag,
  MapPin,
  Link as LinkIcon,
  Calendar,
  Settings,
  UserPlus,
  Check,
  MessageSquare,
  Sparkles,
  Share2,
  Heart,
  MessageCircle
} from 'lucide-react';
import { Post } from '../../types';

export const ProfileView: React.FC = () => {
  const {
    activeProfileId,
    posts,
    reels,
    setSelectedPostDetail,
    setIsEditProfileOpen,
    startDirectMessage,
    toggleFollowUser,
    showToast,
  } = useSocial();

  const { currentUser, allDemoUsers } = useAuth();

  const [activeProfileTab, setActiveProfileTab] = useState<'posts' | 'reels' | 'saved' | 'tagged'>('posts');

  // Find user to display
  const profileUser =
    allDemoUsers.find(u => u.id === activeProfileId) ||
    DEMO_USERS.find(u => u.id === activeProfileId) ||
    currentUser;

  const isOwnProfile = profileUser.id === currentUser.id;

  // User posts
  const userPosts = posts.filter(p => p.userId === profileUser.id);
  const userReels = reels.filter(r => r.userId === profileUser.id);
  const userSavedPosts = posts.filter(p => p.isSaved);

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.origin + `/#@${profileUser.username}`);
    showToast(`Profile link for @${profileUser.username} copied! ✨`, 'neon');
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-3 sm:px-6 select-none">
      {/* 1. Profile Header Container */}
      <div className="relative rounded-3xl overflow-hidden bg-[#121218] border border-white/5 shadow-2xl mb-8">
        {/* Cover Banner */}
        <div className="relative h-44 sm:h-60 w-full overflow-hidden bg-[#0B0B0F]">
          <img
            src={profileUser.bannerUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80'}
            alt="Profile Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-transparent to-black/30" />

          {/* Share Profile button */}
          <button
            onClick={handleShareProfile}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/80 transition-colors border border-white/10"
            title="Share Profile"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Avatar with glowing ring */}
            <div className="relative ring-4 ring-[#121218] rounded-full">
              <Avatar
                src={profileUser.avatarUrl}
                alt={profileUser.fullName}
                size="2xl"
                hasStory={true}
                isVerified={profileUser.isVerified}
                isOnline={profileUser.isOnline}
              />
            </div>

            {/* Actions: Edit or Follow/Message */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {isOwnProfile ? (
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-all hover:border-[#00D9FF]/40"
                >
                  <Settings className="w-4 h-4 text-[#00D9FF]" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => toggleFollowUser(profileUser.id)}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                      profileUser.isFollowing
                        ? 'bg-white/10 text-white border border-white/10'
                        : 'bg-gradient-to-r from-[#00D9FF] to-[#287BFF] text-white shadow-[0_0_15px_rgba(0,217,255,0.4)]'
                    }`}
                  >
                    {profileUser.isFollowing ? (
                      <>
                        <Check className="w-4 h-4 text-[#00D9FF]" />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Follow
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => startDirectMessage(profileUser)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#FF258A]/15 hover:bg-[#FF258A]/25 text-white text-xs font-bold border border-[#FF258A]/30 transition-all shadow-[0_0_15px_rgba(255,37,138,0.2)]"
                  >
                    <MessageSquare className="w-4 h-4 text-[#FF258A]" />
                    Direct Message
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Name & Bio */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] flex items-center gap-2">
              {profileUser.fullName}
            </h1>
            <p className="text-sm text-[#00D9FF] font-semibold">@{profileUser.username}</p>

            <p className="text-xs sm:text-sm text-[#A0A0AA] mt-3 max-w-xl leading-relaxed whitespace-pre-wrap">
              {profileUser.bio}
            </p>

            {/* Extra meta tags */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#A0A0AA]">
              {profileUser.location && (
                <span className="flex items-center gap-1.5 text-white/80">
                  <MapPin className="w-3.5 h-3.5 text-[#00D9FF]" />
                  {profileUser.location}
                </span>
              )}
              {profileUser.website && (
                <a
                  href={profileUser.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-[#00D9FF] hover:underline"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  {profileUser.website.replace('https://', '')}
                </a>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#9B59FF]" />
                {profileUser.joinedDate || 'Joined Aurora 2025'}
              </span>
            </div>

            {/* Metric Counters */}
            <div className="flex items-center gap-8 mt-5 pt-4 border-t border-white/5">
              <div className="text-center sm:text-left">
                <span className="text-base sm:text-lg font-black text-white font-['Outfit']">
                  {userPosts.length || profileUser.postsCount}
                </span>
                <span className="block text-xs text-[#A0A0AA]">Posts</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-base sm:text-lg font-black text-white font-['Outfit']">
                  {(profileUser.followersCount || 0).toLocaleString()}
                </span>
                <span className="block text-xs text-[#A0A0AA]">Followers</span>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-base sm:text-lg font-black text-white font-['Outfit']">
                  {(profileUser.followingCount || 0).toLocaleString()}
                </span>
                <span className="block text-xs text-[#A0A0AA]">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Profile Tabs (Posts, Reels, Saved, Tagged) */}
      <div className="flex items-center justify-center gap-2 sm:gap-6 border-b border-white/10 pb-3 mb-6">
        <button
          onClick={() => setActiveProfileTab('posts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeProfileTab === 'posts'
              ? 'text-[#00D9FF] bg-[#00D9FF]/10 border border-[#00D9FF]/30 shadow-[0_0_12px_rgba(0,217,255,0.2)]'
              : 'text-[#A0A0AA] hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" />
          Posts ({userPosts.length})
        </button>

        <button
          onClick={() => setActiveProfileTab('reels')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeProfileTab === 'reels'
              ? 'text-[#9B59FF] bg-[#9B59FF]/10 border border-[#9B59FF]/30 shadow-[0_0_12px_rgba(155,89,255,0.2)]'
              : 'text-[#A0A0AA] hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          Reels ({userReels.length})
        </button>

        {isOwnProfile && (
          <button
            onClick={() => setActiveProfileTab('saved')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeProfileTab === 'saved'
                ? 'text-[#FFC83D] bg-[#FFC83D]/10 border border-[#FFC83D]/30 shadow-[0_0_12px_rgba(255,200,61,0.2)]'
                : 'text-[#A0A0AA] hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Saved ({userSavedPosts.length})
          </button>
        )}

        <button
          onClick={() => setActiveProfileTab('tagged')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeProfileTab === 'tagged'
              ? 'text-[#FF258A] bg-[#FF258A]/10 border border-[#FF258A]/30 shadow-[0_0_12px_rgba(255,37,138,0.2)]'
              : 'text-[#A0A0AA] hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" />
          Tagged
        </button>
      </div>

      {/* 3. Tab Contents */}
      {/* A. POSTS TAB */}
      {activeProfileTab === 'posts' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {userPosts.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-[#121218] rounded-3xl border border-white/5">
              <Sparkles className="w-8 h-8 text-[#00D9FF] mx-auto mb-2" />
              <p className="text-sm font-bold text-white">No posts shared yet</p>
              <p className="text-xs text-[#A0A0AA] mt-1">
                {isOwnProfile ? 'Create your first post to inspire Aurora!' : 'This creator has not posted yet.'}
              </p>
            </div>
          ) : (
            userPosts.map(post => (
              <div
                key={post.id}
                onClick={() => setSelectedPostDetail(post)}
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group bg-[#121218] border border-white/5 hover:border-[#00D9FF]/40 transition-all"
              >
                <img
                  src={post.mediaUrls[0]}
                  alt="Post preview"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-108"
                />
                {/* Hover overlay with likes and comments */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-sm">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-[#FF258A] text-[#FF258A]" />
                    {post.likesCount}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" />
                    {post.commentsCount}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* B. REELS TAB */}
      {activeProfileTab === 'reels' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {userReels.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-[#121218] rounded-3xl border border-white/5">
              <Film className="w-8 h-8 text-[#9B59FF] mx-auto mb-2" />
              <p className="text-sm font-bold text-white">No reels published</p>
            </div>
          ) : (
            userReels.map(reel => (
              <div
                key={reel.id}
                className="relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer group bg-[#121218] border border-white/5"
              >
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-2 left-2 right-2 text-xs text-white font-bold flex items-center gap-1 drop-shadow">
                  <Heart className="w-3.5 h-3.5 fill-[#FF258A] text-[#FF258A]" />
                  <span>{(reel.likesCount / 1000).toFixed(1)}k</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* C. SAVED POSTS TAB */}
      {activeProfileTab === 'saved' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {userSavedPosts.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-[#121218] rounded-3xl border border-white/5">
              <Bookmark className="w-8 h-8 text-[#FFC83D] mx-auto mb-2" />
              <p className="text-sm font-bold text-white">No saved posts</p>
              <p className="text-xs text-[#A0A0AA] mt-1">Bookmark posts in your feed to review them here.</p>
            </div>
          ) : (
            userSavedPosts.map(post => (
              <div
                key={post.id}
                onClick={() => setSelectedPostDetail(post)}
                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group bg-[#121218] border border-white/5"
              >
                <img
                  src={post.mediaUrls[0]}
                  alt="Saved post"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-[#FFC83D]">
                  <Bookmark className="w-3.5 h-3.5 fill-[#FFC83D]" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* D. TAGGED TAB */}
      {activeProfileTab === 'tagged' && (
        <div className="text-center py-16 bg-[#121218] rounded-3xl border border-white/5">
          <Tag className="w-8 h-8 text-[#FF258A] mx-auto mb-2" />
          <p className="text-sm font-bold text-white">Photos of {profileUser.fullName}</p>
          <p className="text-xs text-[#A0A0AA] mt-1">When friends tag you in photos, they will appear here.</p>
        </div>
      )}
    </div>
  );
};

