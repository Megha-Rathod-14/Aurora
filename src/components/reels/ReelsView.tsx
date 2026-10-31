import React, { useState, useRef, useEffect } from 'react';
import { useSocial } from '../../context/SocialContext';
import { Avatar } from '../common/Avatar';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Volume2,
  VolumeX,
  Music2,
  ChevronUp,
  ChevronDown,
  Check,
  Disc3,
  Sparkles,
  X
} from 'lucide-react';
import { Reel } from '../../types';

export const ReelsView: React.FC = () => {
  const {
    reels,
    likeReel,
    saveReel,
    setShareModalPost,
    toggleFollowUser,
    setActiveProfileId,
    setActiveTab,
    showToast,
  } = useSocial();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [reelsComments, setReelsComments] = useState<{ [reelId: string]: { user: string; text: string; time: string }[] }>({
    reel_1: [
      { user: 'marcuschen', text: 'This drop shook my studio monitors! 🔥', time: '2h ago' },
      { user: 'elenarostova', text: 'Scarlett never misses with the VIP mixes ✨', time: '1h ago' }
    ],
    reel_2: [
      { user: 'alexvance', text: 'Tokyo night vibes captured in pure perfection!', time: '3h ago' }
    ]
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const currentReel = reels[currentIndex];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0); // loop
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(reels.length - 1);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentReel) return;

    setReelsComments(prev => ({
      ...prev,
      [currentReel.id]: [
        ...(prev[currentReel.id] || []),
        { user: 'alexvance', text: commentText.trim(), time: 'Just now' }
      ]
    }));

    setCommentText('');
    showToast('Comment published to Reel 💬', 'neon');
  };

  if (!currentReel) return null;

  return (
    <div className="w-full h-[calc(100vh-2rem)] md:h-screen flex items-center justify-center p-2 sm:p-6 select-none">
      <div className="relative w-full max-w-sm sm:max-w-md h-[92vh] max-h-[820px] rounded-3xl overflow-hidden bg-[#050505] border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col justify-between">
        {/* 1. Video Element with Fallback & Autoplay */}
        <div
          onClick={togglePlayPause}
          className="absolute inset-0 cursor-pointer flex items-center justify-center bg-[#050505]"
        >
          <video
            ref={videoRef}
            src={currentReel.videoUrl}
            poster={currentReel.thumbnailUrl}
            loop
            muted={isMuted}
            playsInline
            autoPlay
            className="w-full h-full object-cover"
          />

          {/* Vignette Shadow Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

          {/* Play/Pause center overlay if paused */}
          {!isPlaying && (
            <div className="p-4 rounded-full bg-black/60 backdrop-blur-md text-white">
              <span className="text-sm font-bold tracking-widest uppercase">Paused</span>
            </div>
          )}
        </div>

        {/* 2. Top Bar (Audio Mute Toggle & Aurora Badge) */}
        <div className="relative z-20 flex items-center justify-between p-4 text-white">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span className="text-xs font-bold font-['Outfit'] tracking-wider">AURORA REELS</span>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 border border-white/10 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#00D9FF]" />}
          </button>
        </div>

        {/* 3. Right Floating Interaction Stack */}
        <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-5">
          {/* Like */}
          <button
            onClick={() => likeReel(currentReel.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div
              className={`p-3 rounded-full backdrop-blur-md border transition-all ${
                currentReel.isLiked
                  ? 'bg-[#FF258A]/30 border-[#FF258A] text-[#FF258A] shadow-[0_0_15px_#FF258A]'
                  : 'bg-black/50 border-white/20 text-white hover:text-[#FF258A]'
              }`}
            >
              <Heart
                className={`w-6 h-6 transition-transform group-active:scale-125 ${
                  currentReel.isLiked ? 'fill-[#FF258A]' : ''
                }`}
              />
            </div>
            <span className="text-xs font-bold text-white drop-shadow-md">
              {(currentReel.likesCount / 1000).toFixed(1)}k
            </span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:text-[#00D9FF] transition-all">
              <MessageCircle className="w-6 h-6 group-active:scale-125" />
            </div>
            <span className="text-xs font-bold text-white drop-shadow-md">
              {currentReel.commentsCount}
            </span>
          </button>

          {/* Share */}
          <button
            onClick={() => {
              showToast('Reel link copied to clipboard! ✨', 'neon');
            }}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:text-[#9B59FF] transition-all">
              <Send className="w-6 h-6 -rotate-12 group-active:scale-125" />
            </div>
            <span className="text-xs font-bold text-white drop-shadow-md">
              {currentReel.sharesCount}
            </span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => saveReel(currentReel.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div
              className={`p-3 rounded-full backdrop-blur-md border transition-all ${
                currentReel.isSaved
                  ? 'bg-[#FFC83D]/30 border-[#FFC83D] text-[#FFC83D] shadow-[0_0_12px_#FFC83D]'
                  : 'bg-black/50 border-white/20 text-white hover:text-[#FFC83D]'
              }`}
            >
              <Bookmark className={`w-6 h-6 ${currentReel.isSaved ? 'fill-[#FFC83D]' : ''}`} />
            </div>
          </button>

          {/* Vinyl Disc Spin Animation */}
          <div className="mt-2 relative p-1 rounded-full bg-gradient-to-tr from-[#00D9FF] to-[#FF258A] animate-spin-slow shadow-[0_0_15px_rgba(0,217,255,0.4)]">
            <Disc3 className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* 4. Bottom Creator Info & Caption */}
        <div className="relative z-20 p-4 pb-5 flex flex-col gap-2 max-w-[80%] text-white">
          {/* Creator Profile */}
          <div className="flex items-center gap-2.5">
            <Avatar
              src={currentReel.user.avatarUrl}
              alt={currentReel.user.fullName}
              size="sm"
              isVerified={currentReel.user.isVerified}
              onClick={() => {
                setActiveProfileId(currentReel.userId);
                setActiveTab('profile');
              }}
            />
            <span
              onClick={() => {
                setActiveProfileId(currentReel.userId);
                setActiveTab('profile');
              }}
              className="text-xs font-bold text-white hover:text-[#00D9FF] cursor-pointer"
            >
              @{currentReel.user.username}
            </span>

            <button
              onClick={() => toggleFollowUser(currentReel.userId)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                currentReel.user.isFollowing
                  ? 'bg-white/10 text-[#A0A0AA] border border-white/10'
                  : 'bg-white text-black hover:bg-[#00D9FF]'
              }`}
            >
              {currentReel.user.isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>

          {/* Caption */}
          <p className="text-xs text-white/95 leading-relaxed line-clamp-2 drop-shadow">
            {currentReel.caption}
          </p>

          {/* Audio track marquee */}
          <div className="flex items-center gap-2 text-xs text-[#00D9FF] mt-1 font-medium">
            <Music2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {currentReel.musicTitle} • {currentReel.musicArtist}
            </span>
          </div>
        </div>

        {/* Up / Down Navigation Controls */}
        <div className="hidden sm:flex absolute -right-16 top-1/2 -translate-y-1/2 flex-col gap-3 z-30">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all hover:scale-110 shadow-lg"
            title="Previous Reel"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all hover:scale-110 shadow-lg"
            title="Next Reel"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

        {/* Comments Drawer Popup */}
        {showComments && (
          <div className="absolute inset-x-0 bottom-0 z-30 bg-[#121218]/95 backdrop-blur-2xl rounded-t-3xl p-4 border-t border-white/10 max-h-80 flex flex-col justify-between shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-[#00D9FF]" />
                Reel Comments
              </h4>
              <button
                onClick={() => setShowComments(false)}
                className="text-[#A0A0AA] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-2 flex flex-col gap-2.5">
              {(reelsComments[currentReel.id] || []).map((c, i) => (
                <div key={i} className="text-xs flex items-start justify-between">
                  <div>
                    <span className="font-bold text-[#00D9FF] mr-1.5">@{c.user}</span>
                    <span className="text-white">{c.text}</span>
                  </div>
                  <span className="text-[10px] text-[#A0A0AA]">{c.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="pt-2 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Add a comment to this reel..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-[#0B0B0F] border border-white/10 text-xs text-white placeholder-[#A0A0AA] focus:outline-none focus:border-[#00D9FF]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#287BFF] text-white text-xs font-bold"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

