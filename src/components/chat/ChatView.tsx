import React, { useState, useRef, useEffect } from 'react';
import { useSocial } from '../../context/SocialContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import { DEMO_USERS } from '../../data/mockData';
import {
  Search,
  Send,
  Image as ImageIcon,
  Smile,
  Phone,
  Video,
  Info,
  MoreVertical,
  Trash2,
  CheckCheck,
  Check,
  Sparkles,
  Paperclip,
  X
} from 'lucide-react';
import { Conversation, UserProfile } from '../../types';

export const ChatView: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    deleteMessage,
    startDirectMessage,
  } = useSocial();

  const { currentUser } = useAuth();

  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active conversation
  const activeConversation: Conversation | undefined =
    conversations.find(c => c.id === activeConversationId) || conversations[0];

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, activeConversation?.isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!messageInput.trim() && !selectedImage) || !activeConversation) return;

    sendMessage(activeConversation.id, messageInput, selectedImage || undefined);
    setMessageInput('');
    setSelectedImage(null);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter(c =>
    c.participant.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.participant.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Potential new users to chat with
  const availableUsers = DEMO_USERS.filter(
    u => u.id !== currentUser.id && !conversations.some(c => c.participant.id === u.id)
  );

  const emojis = ['✨', '❤️', '🔥', '💜', '⚡', '🌌', '🚀', '👏', '😍', '💯', '🌙', '💎'];

  return (
    <div className="w-full h-[calc(100vh-2rem)] md:h-screen p-2 md:p-6 flex flex-col select-none">
      <div className="w-full h-full flex rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* ============================================================== */}
        {/* LEFT COLUMN: CONVERSATION LIST & USER SEARCH */}
        {/* ============================================================== */}
        <div className="w-full sm:w-80 lg:w-96 flex flex-col border-r border-white/10 bg-[#0B0B0F]/90 shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00D9FF]" />
              Messages
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#00D9FF]/15 text-[#00D9FF] border border-[#00D9FF]/30">
              {conversations.length} Active
            </span>
          </div>

          {/* Search bar */}
          <div className="p-3 border-b border-white/5">
            <div className="relative">
              <Search className="w-4 h-4 text-[#A0A0AA] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search conversations & creators..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#121218] border border-white/10 text-xs text-white placeholder-[#A0A0AA] focus:outline-none focus:border-[#00D9FF] transition-all"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-2 flex flex-col gap-1">
            {filteredConversations.map(conv => {
              const isActive = conv.id === activeConversation?.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF258A]/20 via-[#9B59FF]/20 to-transparent border border-[#FF258A]/40 shadow-[0_0_15px_rgba(255,37,138,0.2)]'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Avatar
                      src={conv.participant.avatarUrl}
                      alt={conv.participant.fullName}
                      size="md"
                      isOnline={conv.participant.isOnline}
                      isVerified={conv.participant.isVerified}
                    />
                    <div className="truncate">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-white/90'}`}>
                          {conv.participant.fullName}
                        </p>
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-white/80' : 'text-[#A0A0AA]'}`}>
                        {conv.isTyping ? (
                          <span className="text-[#00D9FF] animate-pulse">Typing...</span>
                        ) : (
                          conv.lastMessage || 'Start a conversation'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                    <span className="text-[10px] text-[#A0A0AA]">{conv.lastMessageTime}</span>
                    {conv.unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-black rounded-full bg-[#FF258A] text-white shadow-[0_0_8px_#FF258A]">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Quick start with suggested creators */}
            {availableUsers.length > 0 && (
              <div className="mt-4 pt-3 border-t border-white/5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#A0A0AA] px-2 block mb-2">
                  Start New Message
                </span>
                <div className="flex flex-col gap-1">
                  {availableUsers.map(user => (
                    <div
                      key={user.id}
                      onClick={() => startDirectMessage(user)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar src={user.avatarUrl} alt={user.fullName} size="xs" isVerified={user.isVerified} />
                        <div>
                          <p className="text-xs font-semibold text-white">{user.fullName}</p>
                          <p className="text-[10px] text-[#A0A0AA]">@{user.username}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#00D9FF] font-semibold">Message</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: ACTIVE CHAT SCREEN */}
        {/* ============================================================== */}
        {activeConversation ? (
          <div className="hidden sm:flex flex-1 flex-col bg-[#050505]/70 backdrop-blur-2xl">
            {/* 1. Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0B0B0F]/60">
              <div className="flex items-center gap-3">
                <Avatar
                  src={activeConversation.participant.avatarUrl}
                  alt={activeConversation.participant.fullName}
                  size="md"
                  isOnline={activeConversation.participant.isOnline}
                  isVerified={activeConversation.participant.isVerified}
                />
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {activeConversation.participant.fullName}
                  </h3>
                  <p className="text-[11px] text-[#A0A0AA] flex items-center gap-1">
                    {activeConversation.participant.isOnline ? (
                      <span className="text-[#00D9FF] font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse" />
                        Online Now
                      </span>
                    ) : (
                      `Last seen ${activeConversation.participant.lastSeen || 'recently'}`
                    )}
                  </p>
                </div>
              </div>

              {/* Chat action controls */}
              <div className="flex items-center gap-1">
                <button
                  className="p-2.5 rounded-xl text-[#A0A0AA] hover:text-white hover:bg-white/5 transition-colors"
                  title="Audio Call (Simulated)"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  className="p-2.5 rounded-xl text-[#A0A0AA] hover:text-white hover:bg-white/5 transition-colors"
                  title="Video Call (Simulated)"
                >
                  <Video className="w-4 h-4" />
                </button>
                <button
                  className="p-2.5 rounded-xl text-[#A0A0AA] hover:text-white hover:bg-white/5 transition-colors"
                  title="Conversation Info"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Messages Bubbles Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col gap-3">
              {activeConversation.messages.map(msg => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    onMouseEnter={() => setHoveredMessageId(msg.id)}
                    onMouseLeave={() => setHoveredMessageId(null)}
                    className={`flex items-end gap-2 group ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <Avatar
                        src={activeConversation.participant.avatarUrl}
                        alt={activeConversation.participant.fullName}
                        size="xs"
                      />
                    )}

                    {/* Delete action button for my messages */}
                    {isMe && hoveredMessageId === msg.id && (
                      <button
                        onClick={() => deleteMessage(activeConversation.id, msg.id)}
                        className="p-1.5 rounded-lg text-[#FF258A] hover:bg-white/10 transition-colors"
                        title="Unsend Message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div
                      className={`relative max-w-sm sm:max-w-md px-4 py-3 rounded-2xl shadow-lg leading-relaxed text-xs transition-all ${
                        isMe
                          ? 'bg-gradient-to-r from-[#9B59FF] to-[#FF258A] text-white rounded-br-sm shadow-[0_0_18px_rgba(255,37,138,0.25)]'
                          : 'bg-[#191922] text-white border border-white/10 rounded-bl-sm'
                      }`}
                    >
                      {/* Optional attached image */}
                      {msg.mediaUrl && (
                        <div className="mb-2 rounded-xl overflow-hidden max-h-60">
                          <img src={msg.mediaUrl} alt="attachment" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-75">
                        <span>{msg.createdAt}</span>
                        {isMe && (
                          <span>
                            {msg.isRead ? (
                              <CheckCheck className="w-3 h-3 text-[#00D9FF]" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {activeConversation.isTyping && (
                <div className="flex items-end gap-2">
                  <Avatar
                    src={activeConversation.participant.avatarUrl}
                    alt={activeConversation.participant.fullName}
                    size="xs"
                  />
                  <div className="px-4 py-2.5 rounded-2xl bg-[#191922] border border-white/10 flex items-center gap-1.5 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9B59FF] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF258A] animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 3. Image Attachment Preview */}
            {selectedImage && (
              <div className="px-6 py-2 bg-[#0B0B0F] border-t border-white/5 flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#00D9FF]">
                  <img src={selectedImage} alt="preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-xs text-[#A0A0AA]">Image attached, press send to broadcast.</span>
              </div>
            )}

            {/* 4. Emoji bar popup */}
            {showEmojiPicker && (
              <div className="px-6 py-2 bg-[#121218] border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {emojis.map(e => (
                  <button
                    key={e}
                    onClick={() => setMessageInput(prev => prev + e)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-base transition-transform hover:scale-125"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}

            {/* 5. Input Field */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-[#0B0B0F]/90 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`p-2.5 rounded-xl transition-colors ${
                  showEmojiPicker ? 'bg-white/15 text-[#FFC83D]' : 'text-[#A0A0AA] hover:text-white hover:bg-white/5'
                }`}
              >
                <Smile className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl text-[#A0A0AA] hover:text-[#00D9FF] hover:bg-white/5 transition-colors"
                title="Attach photo"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <input
                type="text"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                placeholder={`Message ${activeConversation.participant.fullName}...`}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-[#121218] border border-white/10 text-xs text-white placeholder-[#A0A0AA] focus:outline-none focus:border-[#00D9FF] transition-all"
              />

              <button
                type="submit"
                disabled={!messageInput.trim() && !selectedImage}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-[#00D9FF] via-[#9B59FF] to-[#FF258A] text-white shadow-[0_0_15px_rgba(0,217,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(255,37,138,0.5)] transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#A0A0AA]">
            <Sparkles className="w-12 h-12 text-[#00D9FF] mb-3 animate-spin-slow" />
            <h3 className="text-base font-bold text-white">Your Aurora Direct Messages</h3>
            <p className="text-xs text-[#A0A0AA] mt-1 max-w-sm">
              Select an ongoing transmission from the left or discover new creators to connect with.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

