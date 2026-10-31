import React from 'react';
import { useSocial } from '../../context/SocialContext';
import { Bookmark, Sparkles, Heart, MessageCircle } from 'lucide-react';

export const SavedPostsView: React.FC = () => {
  const { posts, setSelectedPostDetail } = useSocial();

  const savedPosts = posts.filter(p => p.isSaved);

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 select-none">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-6">
        <div className="p-3 rounded-2xl bg-[#FFC83D]/10 text-[#FFC83D] border border-[#FFC83D]/30 shadow-[0_0_15px_rgba(255,200,61,0.2)]">
          <Bookmark className="w-6 h-6 fill-[#FFC83D]" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white font-['Outfit']">Saved Bookmarks</h2>
          <p className="text-xs text-[#A0A0AA]">
            Only you can see your personal collection of saved Aurora inspirations
          </p>
        </div>
      </div>

      {/* Grid */}
      {savedPosts.length === 0 ? (
        <div className="text-center py-20 bg-[#121218] rounded-3xl border border-white/5 p-8">
          <Bookmark className="w-12 h-12 text-[#A0A0AA] mx-auto mb-3 opacity-30" />
          <h3 className="text-base font-bold text-white">No Saved Posts Yet</h3>
          <p className="text-xs text-[#A0A0AA] mt-1 max-w-sm mx-auto">
            Click the bookmark icon on any post in your feed or explore grid to save it to your private library.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {savedPosts.map(post => (
            <div
              key={post.id}
              onClick={() => setSelectedPostDetail(post)}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group bg-[#121218] border border-white/5 hover:border-[#FFC83D]/50 transition-all shadow-md"
            >
              <img
                src={post.mediaUrls[0]}
                alt="Saved post"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs">
                <span className="flex items-center gap-1 text-[#FF258A]">
                  <Heart className="w-4 h-4 fill-[#FF258A]" />
                  {post.likesCount}
                </span>
                <span className="flex items-center gap-1 text-white">
                  <MessageCircle className="w-4 h-4" />
                  {post.commentsCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

