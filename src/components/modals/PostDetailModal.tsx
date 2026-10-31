import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import {
  X,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Smile,
  MapPin,
  Share2
} from 'lucide-react';

export const PostDetailModal: React.FC = () => {
  const {
    selectedPostDetail,
    setSelectedPostDetail,
    likePost,
    savePost,
    addComment,
    likeComment,
    setShareModalPost,
    setActiveProfileId,
    setActiveTab,
  } = useSocial();

  const { currentUser } = useAuth();

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);

  if (!selectedPostDetail) return null;

  const post = selectedPostDetail;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput, replyingToCommentId || undefined);
    setCommentInput('');
    setReplyingToCommentId(null);
  };

  const handleUserClick = (userId: string) => {
    setActiveProfileId(userId);
    setActiveTab('profile');
    setSelectedPostDetail(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-2 sm:p-6 select-none">
      {/* Close button */}
      <button
        onClick={() => setSelectedPostDetail(null)}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all hover:rotate-90"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Card */}
      <div className="relative w-full max-w-5xl h-[88vh] max-h-[820px] bg-[#121218] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] grid grid-cols-1 md:grid-cols-12 animate-slide-in">
        {/* ============================================================== */}
        {/* LEFT COLUMN: HIGH-RES MEDIA (7 cols) */}
        {/* ============================================================== */}
        <div className="md:col-span-7 bg-[#050505] flex items-center justify-center relative overflow-hidden h-64 md:h-full border-b md:border-b-0 md:border-r border-white/10">
          <img
            src={post.mediaUrls[activeMediaIndex]}
            alt="post media"
            className="w-full h-full object-contain"
          />

          {/* Carousel controls */}
          {post.mediaUrls.length > 1 && (
            <>
              {activeMediaIndex > 0 && (
                <button
                  onClick={() => setActiveMediaIndex(prev => prev - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {activeMediaIndex < post.mediaUrls.length - 1 && (
                <button
                  onClick={() => setActiveMediaIndex(prev => prev + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Dots */}
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-1.5">
                {post.mediaUrls.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === activeMediaIndex ? 'w-5 bg-[#00D9FF]' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: AUTHOR, COMMENTS & INTERACTION (5 cols) */}
        {/* ============================================================== */}
        <div className="md:col-span-5 flex flex-col justify-between bg-[#0B0B0F]/90 h-[calc(88vh-16rem)] md:h-full">
          {/* 1. Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#121218]/50">
            <div className="flex items-center gap-2.5">
              <Avatar
                src={post.user.avatarUrl}
                alt={post.user.fullName}
                size="sm"
                isVerified={post.user.isVerified}
                onClick={() => handleUserClick(post.userId)}
              />
              <div>
                <p
                  onClick={() => handleUserClick(post.userId)}
                  className="text-xs font-bold text-white hover:text-[#00D9FF] cursor-pointer"
                >
                  {post.user.fullName}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-[#A0A0AA]">
                  {post.location && (
                    <span className="flex items-center gap-0.5 text-[#00D9FF]">
                      <MapPin className="w-3 h-3" />
                      {post.location}
                    </span>
                  )}
                  <span>{post.createdAt}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShareModalPost(post)}
              className="p-2 rounded-xl text-[#A0A0AA] hover:text-white hover:bg-white/5"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Scrollable Comments Thread */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-4">
            {/* Caption item */}
            <div className="flex items-start gap-3 pb-3 border-b border-white/5">
              <Avatar src={post.user.avatarUrl} alt={post.user.fullName} size="xs" />
              <div className="text-xs">
                <span
                  onClick={() => handleUserClick(post.userId)}
                  className="font-bold text-white hover:text-[#00D9FF] cursor-pointer mr-1.5"
                >
                  {post.user.username}
                </span>
                <span className="text-white/90 leading-relaxed">{post.caption}</span>

                {post.hashtags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.hashtags.map((h, i) => (
                      <span key={i} className="text-[11px] font-semibold text-[#00D9FF]">
                        {h}
                      </span>
                    ))}
                  </div>
                )}
                <span className="block text-[10px] text-[#A0A0AA] mt-1">{post.createdAt}</span>
              </div>
            </div>

            {/* Comments list */}
            {post.comments && post.comments.length > 0 ? (
              post.comments.map(c => (
                <div key={c.id} className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <Avatar src={c.user.avatarUrl} alt={c.user.fullName} size="xs" />
                      <div className="text-xs">
                        <span
                          onClick={() => handleUserClick(c.userId)}
                          className="font-bold text-white hover:text-[#00D9FF] cursor-pointer mr-1.5"
                        >
                          {c.user.username}
                        </span>
                        <span className="text-white/80">{c.content}</span>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-[#A0A0AA]">
                          <span>{c.createdAt}</span>
                          {c.likesCount > 0 && <span>{c.likesCount} likes</span>}
                          <button
                            onClick={() => {
                              setReplyingToCommentId(c.id);
                              setCommentInput(`@${c.user.username} `);
                            }}
                            className="text-[#00D9FF] font-semibold hover:underline"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => likeComment(post.id, c.id)}
                      className={`p-1 ${c.isLiked ? 'text-[#FF258A]' : 'text-[#A0A0AA] hover:text-white'}`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${c.isLiked ? 'fill-[#FF258A]' : ''}`} />
                    </button>
                  </div>

                  {/* Replies (if any) */}
                  {c.replies && c.replies.length > 0 && (
                    <div className="ml-8 pl-3 border-l border-white/10 flex flex-col gap-2 mt-1">
                      {c.replies.map(rep => (
                        <div key={rep.id} className="flex items-start gap-2 text-xs">
                          <Avatar src={rep.user.avatarUrl} alt={rep.user.fullName} size="xs" />
                          <div>
                            <span className="font-bold text-[#00D9FF] mr-1">@{rep.user.username}</span>
                            <span className="text-white/80">{rep.content}</span>
                            <span className="block text-[10px] text-[#A0A0AA] mt-0.5">{rep.createdAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-[#A0A0AA] text-xs">
                No comments yet. Start the inspiration!
              </div>
            )}
          </div>

          {/* 3. Action Buttons & Input */}
          <div className="p-4 border-t border-white/10 bg-[#121218]/60">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => likePost(post.id)}
                  className="flex items-center gap-1.5 text-xs font-bold transition-transform active:scale-125"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      post.isLiked ? 'text-[#FF258A] fill-[#FF258A]' : 'text-white hover:text-[#FF258A]'
                    }`}
                  />
                  <span>{post.likesCount.toLocaleString()}</span>
                </button>

                <button
                  onClick={() => setShareModalPost(post)}
                  className="text-white hover:text-[#9B59FF]"
                >
                  <Send className="w-5 h-5 -rotate-12" />
                </button>
              </div>

              <button onClick={() => savePost(post.id)} className="text-white hover:text-[#FFC83D]">
                <Bookmark className={`w-5 h-5 ${post.isSaved ? 'text-[#FFC83D] fill-[#FFC83D]' : ''}`} />
              </button>
            </div>

            {/* Replying banner indicator */}
            {replyingToCommentId && (
              <div className="flex items-center justify-between text-[11px] text-[#00D9FF] mb-2 px-1">
                <span>Replying to comment...</span>
                <button onClick={() => setReplyingToCommentId(null)} className="text-[#A0A0AA] hover:text-white">
                  Cancel
                </button>
              </div>
            )}

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
              <Avatar src={currentUser.avatarUrl} alt={currentUser.fullName} size="xs" />
              <input
                type="text"
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 rounded-xl bg-[#0B0B0F] border border-white/10 text-xs text-white placeholder-[#A0A0AA] focus:outline-none focus:border-[#00D9FF]"
              />
              <button
                type="button"
                onClick={() => setCommentInput(prev => prev + ' 💜')}
                className="text-[#9B59FF] hover:opacity-80 p-1"
              >
                <Smile className="w-4 h-4" />
              </button>
              {commentInput.trim() && (
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#287BFF] text-white text-xs font-bold"
                >
                  Post
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

