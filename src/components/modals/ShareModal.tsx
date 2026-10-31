import React from 'react';
import { useSocial } from '../../context/SocialContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import { X, Copy, Check, Send, Sparkles } from 'lucide-react';

export const ShareModal: React.FC = () => {
  const { shareModalPost, setShareModalPost, conversations, sendMessage, showToast } = useSocial();
  const { currentUser } = useAuth();

  if (!shareModalPost) return null;

  const postUrl = `${window.location.origin}/#post-${shareModalPost.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(postUrl);
    showToast('Post link copied to clipboard! ✨', 'neon');
  };

  const handleSendToConversation = (convId: string, participantName: string) => {
    sendMessage(
      convId,
      `Shared post by @${shareModalPost.user.username}: ${postUrl}`,
      shareModalPost.mediaUrls[0]
    );
    showToast(`Shared post with ${participantName} 🚀`, 'neon');
    setShareModalPost(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 select-none">
      <div className="relative w-full max-w-md bg-[#121218] border border-white/10 rounded-3xl p-5 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00D9FF]" />
            <h3 className="text-base font-bold text-white font-['Outfit']">Share Transmission</h3>
          </div>
          <button
            onClick={() => setShareModalPost(null)}
            className="p-1.5 rounded-full text-[#A0A0AA] hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post preview pill */}
        <div className="my-4 p-3 rounded-2xl bg-[#0B0B0F] border border-white/5 flex items-center gap-3">
          <img
            src={shareModalPost.mediaUrls[0]}
            alt="media"
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div className="truncate flex-1">
            <p className="text-xs font-bold text-white">@{shareModalPost.user.username}</p>
            <p className="text-[11px] text-[#A0A0AA] truncate">{shareModalPost.caption}</p>
          </div>
        </div>

        {/* Direct Send to Conversations */}
        <div className="mb-4">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#A0A0AA] block mb-2">
            Send via Direct Message
          </span>
          <div className="flex flex-col gap-1.5 max-h-44 overflow-y-auto no-scrollbar">
            {conversations.map(conv => (
              <div
                key={conv.id}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Avatar src={conv.participant.avatarUrl} alt={conv.participant.fullName} size="xs" />
                  <div>
                    <p className="text-xs font-semibold text-white">{conv.participant.fullName}</p>
                    <p className="text-[10px] text-[#A0A0AA]">@{conv.participant.username}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleSendToConversation(conv.id, conv.participant.fullName)}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-[#00D9FF] hover:text-black text-white text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  Send
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Copy Link input button */}
        <div className="pt-3 border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={postUrl}
            className="flex-1 px-3 py-2 rounded-xl bg-[#0B0B0F] border border-white/10 text-xs text-[#A0A0AA] select-all focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00D9FF] to-[#287BFF] text-white text-xs font-bold shadow-md hover:scale-102 transition-transform flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

