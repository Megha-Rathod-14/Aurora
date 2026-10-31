import React, { useState, useRef } from 'react';
import { Post } from '../../types';
import { useSocial } from '../../context/SocialContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import { DoubleTapHeart } from './DoubleTapHeart';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Smile,
  Trash2,
  Share2,
  ExternalLink
} from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    likePost,
    savePost,
    addComment,
    likeComment,
    deletePost,
    setShareModalPost,
    setSelectedPostDetail,
    setActiveProfileId,
    setActiveTab,
    toggleFollowUser,
    showToast,
  } = useSocial();

  const { currentUser } = useAuth();

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastTapRef = useRef<number>(0);

  const isOwner = post.userId === currentUser.id;

  // Handle Double-tap / Double-click to like
  const handleMediaClick = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (!post.isLiked) {
        likePost(post.id);
      }
      setShowHeartPop(true);
      setTimeout(() => setShowHeartPop(false), 900);
    }
    lastTapRef.current = now;
  };

  const handleNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMediaIndex < post.mediaUrls.length - 1) {
      setCurrentMediaIndex(prev => prev + 1);
    }
  };

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(prev => prev - 1);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(post.id, commentInput);
    setCommentInput('');
    setShowCommentsDrawer(true);
  };

  const handleUserClick = () => {
    setActiveProfileId(post.userId);
    setActiveTab('profile');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + `#post-${post.id}`);
    showToast('Link copied to clipboard! ✨', 'neon');
    setIsMenuOpen(false);
  };

  return (
    <article className="w-full bg-[#121218] border border-white/5 rounded-3xl overflow-hidden mb-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all hover:border-white/10 select-none">
      {/* 1. Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar
            src={post.user.avatarUrl}
            alt={post.user.fullName}
            size="md"
            isVerified={post.user.isVerified}
            onClick={handleUserClick}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span
                onClick={handleUserClick}
                className="text-sm font-bold text-white hover:text-[#00D9FF] cursor-pointer transition-colors"
              >
                {post.user.fullName}
              </span>
              <span className="text-xs text-[#A0A0AA]">@{post.user.username}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#A0A0AA]">
              {post.location && (
                <span className="flex items-center gap-0.5 text-[#00D9FF]">
                  <MapPin className="w-3 h-3" />
                  {post.location}
                </span>
              )}
              {post.location && <span>•</span>}
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Post Options Menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-xl text-[#A0A0AA] hover:text-white hover:bg-white/5 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 glass-dropdown rounded-2xl p-1.5 shadow-2xl z-40 border border-white/10 animate-slide-in">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-[#00D9FF]" />
                Copy Post Link
              </button>

              <button
                onClick={() => {
                  setShareModalPost(post);
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <Share2 className="w-4 h-4 text-[#9B59FF]" />
                Share Post
              </button>

              {!isOwner && (
                <button
                  onClick={() => {
                    toggleFollowUser(post.userId);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#FFC83D] hover:bg-white/10 rounded-xl transition-colors"
                >
                  {post.user.isFollowing ? 'Unfollow Creator' : 'Follow Creator'}
                </button>
              )}

              {isOwner && (
                <button
                  onClick={() => {
                    deletePost(post.id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#FF258A] hover:bg-[#FF258A]/10 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Post Media with Double-Click Like */}
      <div
        onClick={handleMediaClick}
        className="relative w-full bg-[#050505] overflow-hidden cursor-pointer flex items-center justify-center max-h-[560px]"
      >
        <img
          src={post.mediaUrls[currentMediaIndex]}
          alt="Post content"
          className="w-full h-full object-cover max-h-[560px]"
          loading="lazy"
        />

        {/* Double-tap animated heart pop */}
        <DoubleTapHeart show={showHeartPop} />

        {/* Carousel controls if multi-media */}
        {post.mediaUrls.length > 1 && (
          <>
            {currentMediaIndex > 0 && (
              <button
                onClick={handlePrevMedia}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/90 transition-all z-20"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {currentMediaIndex < post.mediaUrls.length - 1 && (
              <button
                onClick={handleNextMedia}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/90 transition-all z-20"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Dots indicator */}
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-20">
              {post.mediaUrls.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentMediaIndex ? 'w-5 bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 3. Action Buttons Bar */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <button
              onClick={() => likePost(post.id)}
              className="flex items-center gap-1.5 text-sm font-semibold transition-transform active:scale-125"
            >
              <Heart
                className={`w-6 h-6 transition-all duration-300 ${
                  post.isLiked
                    ? 'text-[#FF258A] fill-[#FF258A] filter drop-shadow-[0_0_12px_#FF258A]'
                    : 'text-white hover:text-[#FF258A]'
                }`}
              />
              <span className={post.isLiked ? 'text-[#FF258A]' : 'text-white'}>
                {post.likesCount.toLocaleString()}
              </span>
            </button>

            {/* Comment Button */}
            <button
              onClick={() => setShowCommentsDrawer(!showCommentsDrawer)}
              className="flex items-center gap-1.5 text-sm font-semibold text-white hover:text-[#00D9FF] transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
              <span>{post.commentsCount.toLocaleString()}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => setShareModalPost(post)}
              className="p-1 text-white hover:text-[#9B59FF] transition-colors"
              title="Share"
            >
              <Send className="w-6 h-6 -rotate-12" />
            </button>
          </div>

          {/* Bookmark / Save Button */}
          <button
            onClick={() => savePost(post.id)}
            className="p-1 transition-all active:scale-125"
            title="Save post"
          >
            <Bookmark
              className={`w-6 h-6 transition-colors ${
                post.isSaved
                  ? 'text-[#FFC83D] fill-[#FFC83D] filter drop-shadow-[0_0_10px_#FFC83D]'
                  : 'text-white hover:text-[#FFC83D]'
              }`}
            />
          </button>
        </div>

        {/* 4. Caption and Hashtags */}
        <div className="mt-3 text-sm">
          <p className="text-white leading-relaxed">
            <span
              onClick={handleUserClick}
              className="font-bold hover:text-[#00D9FF] cursor-pointer mr-2"
            >
              {post.user.username}
            </span>
            {post.caption}
          </p>

          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {post.hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold text-[#00D9FF] hover:text-[#9B59FF] cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Comments Count / Detail Link */}
        {post.commentsCount > 0 && (
          <button
            onClick={() => setSelectedPostDetail(post)}
            className="mt-2 text-xs font-medium text-[#A0A0AA] hover:text-white transition-colors"
          >
            View all {post.commentsCount} comments & discussion
          </button>
        )}

        {/* 5. Inline Expandable Comments Drawer */}
        {showCommentsDrawer && post.comments && post.comments.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-2.5 max-h-48 overflow-y-auto no-scrollbar">
            {post.comments.map(c => (
              <div key={c.id} className="flex items-start justify-between gap-2 text-xs">
                <div className="flex items-start gap-2">
                  <Avatar src={c.user.avatarUrl} alt={c.user.fullName} size="xs" />
                  <div>
                    <span className="font-bold text-white mr-1.5">{c.user.username}</span>
                    <span className="text-[#A0A0AA]">{c.content}</span>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-[#A0A0AA]">
                      <span>{c.createdAt}</span>
                      {c.likesCount > 0 && <span>{c.likesCount} likes</span>}
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
            ))}
          </div>
        )}

        {/* 6. Inline Add Comment Input */}
        <form onSubmit={handleCommentSubmit} className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2.5">
          <Avatar src={currentUser.avatarUrl} alt={currentUser.fullName} size="xs" />
          <input
            type="text"
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            placeholder="Add a comment to this inspiration..."
            className="flex-1 bg-transparent text-xs text-white placeholder-[#A0A0AA] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setCommentInput(prev => prev + ' ✨')}
            className="text-[#FFC83D] hover:opacity-80 p-1"
          >
            <Smile className="w-4 h-4" />
          </button>
          {commentInput.trim() && (
            <button
              type="submit"
              className="text-xs font-bold text-[#00D9FF] hover:text-[#9B59FF] transition-colors"
            >
              Post
            </button>
          )}
        </form>
      </div>
    </article>
  );
};

