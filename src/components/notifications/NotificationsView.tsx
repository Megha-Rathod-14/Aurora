import React, { useState } from 'react';
import { useSocial } from '../../context/SocialContext';
import { Avatar } from '../common/Avatar';
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  Eye,
  CheckCheck,
  Sparkles,
  Filter
} from 'lucide-react';
import { NotificationItem } from '../../types';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    toggleFollowUser,
    setActiveProfileId,
    setActiveTab,
    posts,
    setSelectedPostDetail,
  } = useSocial();

  const [filterType, setFilterType] = useState<'all' | 'like' | 'comment' | 'follow' | 'mention'>('all');

  const filteredNotifications = notifications.filter(
    n => filterType === 'all' || n.type === filterType
  );

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-[#FF258A] fill-[#FF258A]" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 text-[#00D9FF]" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-[#9B59FF]" />;
      case 'mention':
        return <AtSign className="w-3.5 h-3.5 text-[#FFC83D]" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#00D9FF]" />;
    }
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    markNotificationAsRead(notif.id);
    if (notif.postId) {
      const targetPost = posts.find(p => p.id === notif.postId);
      if (targetPost) {
        setSelectedPostDetail(targetPost);
      }
    } else {
      setActiveProfileId(notif.actor.id);
      setActiveTab('profile');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-['Outfit']">Notifications</h2>
            <p className="text-xs text-[#A0A0AA]">Real-time social interactions & transmissions</p>
          </div>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#00D9FF] border border-white/10 transition-colors"
        >
          <CheckCheck className="w-4 h-4" />
          Mark All Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 pb-4 overflow-x-auto no-scrollbar mb-4">
        {(['all', 'like', 'comment', 'follow', 'mention'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
              filterType === f
                ? 'bg-gradient-to-r from-[#00D9FF] to-[#9B59FF] text-white shadow-[0_0_12px_rgba(0,217,255,0.3)]'
                : 'bg-[#121218] text-[#A0A0AA] hover:text-white border border-white/5'
            }`}
          >
            {f === 'all' ? 'All Updates' : `${f}s`}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-2.5">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16 bg-[#121218] rounded-3xl border border-white/5 p-8">
            <Bell className="w-10 h-10 text-[#A0A0AA] mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-white">No notifications yet</h3>
            <p className="text-xs text-[#A0A0AA] mt-1">
              When others like your creations, mention you, or follow your journey, updates appear here.
            </p>
          </div>
        ) : (
          filteredNotifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all ${
                notif.isRead
                  ? 'bg-[#121218]/50 hover:bg-[#121218] border border-white/5'
                  : 'bg-[#191922] hover:bg-[#1f1f2c] border border-[#00D9FF]/30 shadow-[0_0_15px_rgba(0,217,255,0.1)]'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar with type badge */}
                <div className="relative">
                  <Avatar
                    src={notif.actor.avatarUrl}
                    alt={notif.actor.fullName}
                    size="md"
                    isVerified={notif.actor.isVerified}
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#050505] ring-1 ring-white/10 shadow-sm">
                    {getNotificationIcon(notif.type)}
                  </div>
                </div>

                {/* Text explanation */}
                <div className="text-xs">
                  <p className="text-white leading-relaxed">
                    <span className="font-bold mr-1 hover:text-[#00D9FF]">
                      {notif.actor.fullName}
                    </span>
                    {notif.type === 'like' && 'liked your transmission'}
                    {notif.type === 'comment' && 'commented on your post'}
                    {notif.type === 'follow' && 'started following your journey'}
                    {notif.type === 'mention' && (notif.commentText || 'mentioned you in a transmission')}
                    {notif.type === 'story_view' && 'viewed your Aurora story ring'}
                  </p>
                  {notif.commentText && notif.type === 'comment' && (
                    <p className="text-[#A0A0AA] italic mt-0.5 line-clamp-1">"{notif.commentText}"</p>
                  )}
                  <span className="text-[10px] text-[#A0A0AA] mt-1 block">{notif.createdAt}</span>
                </div>
              </div>

              {/* Trailing: Post Thumbnail or Follow Button */}
              <div className="shrink-0 ml-3">
                {notif.postMediaUrl ? (
                  <img
                    src={notif.postMediaUrl}
                    alt="post"
                    className="w-11 h-11 rounded-xl object-cover border border-white/10"
                  />
                ) : notif.type === 'follow' ? (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleFollowUser(notif.actor.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      notif.actor.isFollowing
                        ? 'bg-white/10 text-white'
                        : 'bg-gradient-to-r from-[#00D9FF] to-[#287BFF] text-white'
                    }`}
                  >
                    {notif.actor.isFollowing ? 'Following' : 'Follow Back'}
                  </button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

