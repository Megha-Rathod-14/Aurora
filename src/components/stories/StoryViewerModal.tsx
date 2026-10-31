import React, { useState, useEffect, useRef } from 'react';
import { useSocial } from '../../context/SocialContext';
import { Avatar } from '../common/Avatar';
import { X, Heart, Send, ChevronLeft, ChevronRight, Eye, Clock, Sparkles } from 'lucide-react';

export const StoryViewerModal: React.FC = () => {
  const {
    activeStoryUserId,
    setActiveStoryUserId,
    stories,
    markStoryViewed,
    likeStory,
    sendMessage,
    conversations,
    startDirectMessage,
    showToast,
  } = useSocial();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [showViewersModal, setShowViewersModal] = useState(false);

  // Filter stories for this user
  const userStories = stories.filter(s => s.userId === activeStoryUserId);
  const currentStory = userStories[currentIndex];

  const duration = 5000; // 5 seconds per story
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    setCurrentIndex(0);
    setProgress(0);
    setIsLiked(false);
  }, [activeStoryUserId]);

  useEffect(() => {
    if (!currentStory) return;
    markStoryViewed(currentStory.id);
  }, [currentStory]);

  // Timer loop for progress bar
  useEffect(() => {
    if (!activeStoryUserId || !currentStory || isPaused) return;

    const tick = 50;
    const step = (tick / duration) * 100;

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, tick);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeStoryUserId, currentIndex, isPaused, userStories.length]);

  if (!activeStoryUserId || !currentStory) return null;

  const handleNext = () => {
    if (currentIndex < userStories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
      setIsLiked(false);
    } else {
      // Find next user with stories
      const uniqueUserIds = Array.from(new Set(stories.map(s => s.userId)));
      const currentUserIndex = uniqueUserIds.indexOf(activeStoryUserId);
      if (currentUserIndex < uniqueUserIds.length - 1) {
        setActiveStoryUserId(uniqueUserIds[currentUserIndex + 1]);
      } else {
        setActiveStoryUserId(null);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
      setIsLiked(false);
    } else {
      const uniqueUserIds = Array.from(new Set(stories.map(s => s.userId)));
      const currentUserIndex = uniqueUserIds.indexOf(activeStoryUserId);
      if (currentUserIndex > 0) {
        setActiveStoryUserId(uniqueUserIds[currentUserIndex - 1]);
      } else {
        setProgress(0);
      }
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    // Send as message in DM
    const existing = conversations.find(c => c.participant.id === currentStory.userId);
    if (existing) {
      sendMessage(existing.id, `Replied to your story: "${replyText.trim()}"`);
    } else {
      startDirectMessage(currentStory.user);
    }

    showToast(`Reply sent to @${currentStory.user.username} 💬`, 'neon');
    setReplyText('');
  };

  const handleHeartClick = () => {
    setIsLiked(true);
    likeStory(currentStory.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl select-none">
      {/* Top Close Button */}
      <button
        onClick={() => setActiveStoryUserId(null)}
        className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all hover:rotate-90"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Story Container (Mobile phone aspect ratio in desktop) */}
      <div
        className="relative w-full max-w-md h-[90vh] max-h-[820px] rounded-3xl overflow-hidden bg-[#0B0B0F] shadow-[0_0_50px_rgba(0,217,255,0.2)] border border-white/10 flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress Bars at top */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
          {userStories.map((s, idx) => (
            <div key={s.id} className="h-1 flex-1 rounded-full bg-white/25 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00D9FF] to-[#FF258A] transition-all duration-75"
                style={{
                  width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="absolute top-7 left-4 right-4 z-30 flex items-center justify-between text-white drop-shadow-md">
          <div className="flex items-center gap-2.5">
            <Avatar src={currentStory.user.avatarUrl} alt={currentStory.user.fullName} size="sm" isVerified={currentStory.user.isVerified} />
            <div>
              <p className="text-xs font-bold leading-none">{currentStory.user.username}</p>
              <div className="flex items-center gap-1.5 text-[10px] text-[#A0A0AA] mt-0.5">
                <Clock className="w-3 h-3 text-[#00D9FF]" />
                <span>{currentStory.createdAt}</span>
                <span>•</span>
                <span className="text-[#FFC83D]">{currentStory.expiresAt}</span>
              </div>
            </div>
          </div>

          {/* Viewers trigger button */}
          <button
            onClick={() => setShowViewersModal(!showViewersModal)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium hover:bg-black/60 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>{currentStory.viewers.length}</span>
          </button>
        </div>

        {/* Media Background */}
        <div className="relative w-full h-full flex items-center justify-center bg-[#050505]">
          <img
            src={currentStory.mediaUrl}
            alt="Story content"
            className="w-full h-full object-cover select-none"
          />

          {/* Vignette gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none" />

          {/* Click navigation overlays */}
          <div
            onClick={handlePrev}
            className="absolute left-0 top-16 bottom-24 w-1/3 z-20 cursor-w-resize"
          />
          <div
            onClick={handleNext}
            className="absolute right-0 top-16 bottom-24 w-1/3 z-20 cursor-e-resize"
          />
        </div>

        {/* Story Caption (if any) */}
        {currentStory.caption && (
          <div className="absolute bottom-20 left-4 right-4 z-30 p-3 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10">
            <p className="text-xs text-white leading-relaxed">{currentStory.caption}</p>
          </div>
        )}

        {/* Bottom Interactive Bar */}
        <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center gap-2">
          <form onSubmit={handleSendReply} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder={`Send reply to ${currentStory.user.username}...`}
              className="w-full py-2.5 px-4 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white placeholder-[#A0A0AA] text-xs focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] transition-all"
            />
            {replyText.trim() && (
              <button
                type="submit"
                className="p-2.5 rounded-full bg-gradient-to-r from-[#00D9FF] to-[#287BFF] text-white shadow-[0_0_12px_#00D9FF]"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          <button
            onClick={handleHeartClick}
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
              isLiked
                ? 'bg-[#FF258A]/20 border-[#FF258A] text-[#FF258A] shadow-[0_0_15px_#FF258A]'
                : 'bg-black/50 border-white/20 text-white hover:text-[#FF258A]'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#FF258A] scale-110' : ''} transition-transform`} />
          </button>
        </div>

        {/* Left/Right arrow controls */}
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute -left-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Viewers modal */}
      {showViewersModal && (
        <div className="absolute inset-x-0 bottom-0 max-w-md mx-auto z-40 bg-[#121218] border-t border-white/10 rounded-t-3xl p-5 shadow-2xl animate-slide-in">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#00D9FF]" />
              Story Viewers ({currentStory.viewers.length})
            </h4>
            <button
              onClick={() => setShowViewersModal(false)}
              className="text-[#A0A0AA] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto no-scrollbar">
            {currentStory.viewers.length === 0 ? (
              <p className="text-xs text-[#A0A0AA] text-center py-4">No viewers recorded yet.</p>
            ) : (
              currentStory.viewers.map(viewer => (
                <div key={viewer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar src={viewer.avatarUrl} alt={viewer.fullName} size="xs" isVerified={viewer.isVerified} />
                    <div>
                      <p className="text-xs font-semibold text-white">{viewer.fullName}</p>
                      <p className="text-[10px] text-[#A0A0AA]">@{viewer.username}</p>
                    </div>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-[#00D9FF]" />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
