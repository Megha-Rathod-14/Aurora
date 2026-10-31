import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, Story, Reel, Conversation, NotificationItem, UserProfile, PostComment, ActiveTab } from '../types';
import { INITIAL_POSTS, INITIAL_STORIES, INITIAL_REELS, INITIAL_CONVERSATIONS, INITIAL_NOTIFICATIONS, DEMO_USERS } from '../data/mockData';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'neon';
}

interface SocialContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeProfileId: string;
  setActiveProfileId: (id: string) => void;

  // Posts
  posts: Post[];
  likePost: (postId: string) => void;
  savePost: (postId: string) => void;
  addComment: (postId: string, content: string, parentId?: string) => void;
  likeComment: (postId: string, commentId: string) => void;
  createPost: (postData: { mediaUrls: string[]; mediaType: 'image' | 'video' | 'carousel'; caption: string; hashtags: string[]; location?: string; aspectRatio?: 'square' | 'portrait' | 'landscape' }) => void;
  deletePost: (postId: string) => void;

  // Stories
  stories: Story[];
  activeStoryUserId: string | null;
  setActiveStoryUserId: (userId: string | null) => void;
  createStory: (mediaUrl: string, mediaType: 'image' | 'video', caption?: string) => void;
  markStoryViewed: (storyId: string) => void;
  likeStory: (storyId: string) => void;

  // Reels
  reels: Reel[];
  likeReel: (reelId: string) => void;
  saveReel: (reelId: string) => void;

  // Messaging & Chat
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (convId: string | null) => void;
  sendMessage: (conversationId: string, text: string, mediaUrl?: string) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  startDirectMessage: (user: UserProfile) => void;

  // Follow
  toggleFollowUser: (userId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;

  // Modals
  isCreatePostOpen: boolean;
  setIsCreatePostOpen: (open: boolean) => void;
  isCreateStoryOpen: boolean;
  setIsCreateStoryOpen: (open: boolean) => void;
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (open: boolean) => void;
  selectedPostDetail: Post | null;
  setSelectedPostDetail: (post: Post | null) => void;
  shareModalPost: Post | null;
  setShareModalPost: (post: Post | null) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'neon') => void;
  removeToast: (id: string) => void;

  // Celebration
  triggerNeonCelebration: () => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

function getSafeStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (!parsed) return fallback;
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    return parsed;
  } catch (err) {
    console.warn(`Failed to parse localStorage key "${key}", falling back.`, err);
    try {
      localStorage.removeItem(key);
    } catch {}
    return fallback;
  }
}

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');
  const [activeProfileId, setActiveProfileId] = useState<string>(currentUser?.id || 'usr_me');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Storage keys
  const [posts, setPosts] = useState<Post[]>(() => getSafeStorage('aurora_posts', INITIAL_POSTS));
  const [stories, setStories] = useState<Story[]>(() => getSafeStorage('aurora_stories', INITIAL_STORIES));
  const [reels, setReels] = useState<Reel[]>(() => getSafeStorage('aurora_reels', INITIAL_REELS));
  const [conversations, setConversations] = useState<Conversation[]>(() => getSafeStorage('aurora_conversations', INITIAL_CONVERSATIONS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => getSafeStorage('aurora_notifications', INITIAL_NOTIFICATIONS));

  // Modals state
  const [activeStoryUserId, setActiveStoryUserId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv_1');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState<boolean>(false);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState<boolean>(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [selectedPostDetail, setSelectedPostDetail] = useState<Post | null>(null);
  const [shareModalPost, setShareModalPost] = useState<Post | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('aurora_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('aurora_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('aurora_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('aurora_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // When current user changes, adjust profile target
  useEffect(() => {
    setActiveProfileId(currentUser.id);
  }, [currentUser.id]);

  const showToast = (message: string, type: 'success' | 'info' | 'neon' = 'neon') => {
    const id = `toast_${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerNeonCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#00D9FF', '#FF258A', '#9B59FF', '#FFC83D', '#287BFF']
    });
  };

  // POSTS ACTIONS
  const likePost = (postId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const wasLiked = post.isLiked;
          const newLiked = !wasLiked;
          const newCount = newLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1);

          // If liking, trigger notification
          if (newLiked && post.userId !== currentUser.id) {
            const newNotif: NotificationItem = {
              id: `notif_${Date.now()}`,
              userId: post.userId,
              actor: currentUser,
              type: 'like',
              postId: post.id,
              postMediaUrl: post.mediaUrls[0],
              isRead: false,
              createdAt: 'Just now',
            };
            setNotifications(n => [newNotif, ...n]);
          }

          return {
            ...post,
            isLiked: newLiked,
            likesCount: newCount,
          };
        }
        return post;
      })
    );
  };

  const savePost = (postId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const newSaved = !post.isSaved;
          showToast(newSaved ? 'Saved to bookmarks ✨' : 'Removed from bookmarks');
          return {
            ...post,
            isSaved: newSaved,
            savesCount: newSaved ? post.savesCount + 1 : Math.max(0, post.savesCount - 1),
          };
        }
        return post;
      })
    );
  };

  const addComment = (postId: string, content: string, parentId?: string) => {
    if (!content.trim()) return;

    const newComment: PostComment = {
      id: `c_${Date.now()}`,
      postId,
      userId: currentUser.id,
      user: currentUser,
      content: content.trim(),
      likesCount: 0,
      isLiked: false,
      createdAt: 'Just now',
      replies: [],
    };

    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          let updatedComments = post.comments || [];
          if (parentId) {
            updatedComments = updatedComments.map(c => {
              if (c.id === parentId) {
                return {
                  ...c,
                  replies: [...(c.replies || []), newComment],
                };
              }
              return c;
            });
          } else {
            updatedComments = [newComment, ...updatedComments];
          }

          // Add notification to post owner
          if (post.userId !== currentUser.id) {
            const notif: NotificationItem = {
              id: `notif_${Date.now()}`,
              userId: post.userId,
              actor: currentUser,
              type: 'comment',
              postId: post.id,
              postMediaUrl: post.mediaUrls[0],
              commentText: content.trim(),
              isRead: false,
              createdAt: 'Just now',
            };
            setNotifications(n => [notif, ...n]);
          }

          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: updatedComments,
          };
        }
        return post;
      })
    );

    // Also update selectedPostDetail if opened
    if (selectedPostDetail && selectedPostDetail.id === postId) {
      setSelectedPostDetail(prev => {
        if (!prev) return null;
        let updatedComments = prev.comments || [];
        if (parentId) {
          updatedComments = updatedComments.map(c => (c.id === parentId ? { ...c, replies: [...(c.replies || []), newComment] } : c));
        } else {
          updatedComments = [newComment, ...updatedComments];
        }
        return {
          ...prev,
          commentsCount: prev.commentsCount + 1,
          comments: updatedComments,
        };
      });
    }

    showToast('Comment published 💬');
  };

  const likeComment = (postId: string, commentId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId && post.comments) {
          return {
            ...post,
            comments: post.comments.map(c => {
              if (c.id === commentId) {
                const isLiked = !c.isLiked;
                return {
                  ...c,
                  isLiked,
                  likesCount: isLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1),
                };
              }
              return c;
            })
          };
        }
        return post;
      })
    );
  };

  const createPost = (postData: {
    mediaUrls: string[];
    mediaType: 'image' | 'video' | 'carousel';
    caption: string;
    hashtags: string[];
    location?: string;
    aspectRatio?: 'square' | 'portrait' | 'landscape';
  }) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      mediaUrls: postData.mediaUrls,
      mediaType: postData.mediaType,
      caption: postData.caption,
      hashtags: postData.hashtags,
      location: postData.location,
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      isLiked: true,
      isSaved: false,
      createdAt: 'Just now',
      aspectRatio: postData.aspectRatio || 'portrait',
      comments: [],
    };

    setPosts(prev => [newPost, ...prev]);
    setIsCreatePostOpen(false);
    triggerNeonCelebration();
    showToast('Your post has illuminated the feed! ⚡🌌', 'neon');
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    if (selectedPostDetail?.id === postId) {
      setSelectedPostDetail(null);
    }
    showToast('Post deleted', 'info');
  };

  // STORIES ACTIONS
  const createStory = (mediaUrl: string, mediaType: 'image' | 'video', caption?: string) => {
    const newStory: Story = {
      id: `story_${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      mediaUrl,
      mediaType,
      caption,
      createdAt: 'Just now',
      expiresAt: '24h remaining',
      viewers: [],
      isViewed: false,
    };

    setStories(prev => [newStory, ...prev]);
    setIsCreateStoryOpen(false);
    showToast('Story added to Aurora ring! 💫', 'neon');
  };

  const markStoryViewed = (storyId: string) => {
    setStories(prev =>
      prev.map(s => (s.id === storyId ? { ...s, isViewed: true } : s))
    );
  };

  const likeStory = (storyId: string) => {
    showToast('Sent a glowing reaction ❤️', 'neon');
  };

  // REELS ACTIONS
  const likeReel = (reelId: string) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === reelId) {
          const isLiked = !r.isLiked;
          return {
            ...r,
            isLiked,
            likesCount: isLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1),
          };
        }
        return r;
      })
    );
  };

  const saveReel = (reelId: string) => {
    setReels(prev =>
      prev.map(r => {
        if (r.id === reelId) {
          const isSaved = !r.isSaved;
          showToast(isSaved ? 'Reel bookmarked 🎬' : 'Reel removed');
          return { ...r, isSaved };
        }
        return r;
      })
    );
  };

  // CHAT & MESSAGING
  const sendMessage = (conversationId: string, text: string, mediaUrl?: string) => {
    if (!text.trim() && !mediaUrl) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      text: text.trim(),
      mediaUrl,
      mediaType: mediaUrl ? ('image' as const) : undefined,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: text.trim() || 'Sent an image attachment',
            lastMessageTime: 'Just now',
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      })
    );

    // Auto-reply simulation for realistic interaction!
    const activeConv = conversations.find(c => c.id === conversationId);
    if (activeConv && activeConv.participant.id !== currentUser.id) {
      setTimeout(() => {
        // Show typing indicator
        setConversations(prev =>
          prev.map(conv => (conv.id === conversationId ? { ...conv, isTyping: true } : conv))
        );

        setTimeout(() => {
          const replies = [
            `Love this! Exactly what I was looking for ✨`,
            `Totally agree! Let's collaborate on this soon 🔥`,
            `Checked it out on Aurora feed, looks phenomenal! ⚡`,
            `Thanks for sending! Let me review and get back in 5 mins 🎧`,
            `Neon vibes 🌌`
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];

          const replyMsg = {
            id: `msg_${Date.now()}`,
            conversationId,
            senderId: activeConv.participant.id,
            text: randomReply,
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: true,
          };

          setConversations(prev =>
            prev.map(conv => {
              if (conv.id === conversationId) {
                return {
                  ...conv,
                  isTyping: false,
                  lastMessage: randomReply,
                  lastMessageTime: 'Just now',
                  messages: [...conv.messages, replyMsg],
                };
              }
              return conv;
            })
          );
        }, 2200);
      }, 900);
    }
  };

  const deleteMessage = (conversationId: string, messageId: string) => {
    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: conv.messages.filter(m => m.id !== messageId),
          };
        }
        return conv;
      })
    );
    showToast('Message unsent', 'info');
  };

  const startDirectMessage = (user: UserProfile) => {
    // Check if conversation already exists
    const existing = conversations.find(c => c.participant.id === user.id);
    if (existing) {
      setActiveConversationId(existing.id);
      setActiveTab('messages');
      return;
    }

    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      participantIds: [currentUser.id, user.id],
      participant: user,
      lastMessage: 'Started a new conversation',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      messages: [],
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setActiveTab('messages');
  };

  // FOLLOW
  const toggleFollowUser = (userId: string) => {
    let nowFollowing = false;

    setPosts(prev =>
      prev.map(p => {
        if (p.userId === userId) {
          const isFoll = !p.user.isFollowing;
          nowFollowing = isFoll;
          return {
            ...p,
            user: {
              ...p.user,
              isFollowing: isFoll,
              followersCount: isFoll ? p.user.followersCount + 1 : Math.max(0, p.user.followersCount - 1),
            }
          };
        }
        return p;
      })
    );

    const targetUser = DEMO_USERS.find(u => u.id === userId);
    if (targetUser) {
      targetUser.isFollowing = !targetUser.isFollowing;
    }

    showToast(nowFollowing ? 'Following creator ⚡' : 'Unfollowed', 'info');
  };

  // NOTIFICATIONS
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read');
  };

  return (
    <SocialContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeProfileId,
        setActiveProfileId,

        // Posts
        posts,
        likePost,
        savePost,
        addComment,
        likeComment,
        createPost,
        deletePost,

        // Stories
        stories,
        activeStoryUserId,
        setActiveStoryUserId,
        createStory,
        markStoryViewed,
        likeStory,

        // Reels
        reels,
        likeReel,
        saveReel,

        // Messaging
        conversations,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        deleteMessage,
        startDirectMessage,

        // Follow
        toggleFollowUser,

        // Notifications
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        // Modals
        isCreatePostOpen,
        setIsCreatePostOpen,
        isCreateStoryOpen,
        setIsCreateStoryOpen,
        isEditProfileOpen,
        setIsEditProfileOpen,
        selectedPostDetail,
        setSelectedPostDetail,
        shareModalPost,
        setShareModalPost,

        // Search
        searchQuery,
        setSearchQuery,

        // Toasts
        toasts,
        showToast,
        removeToast,

        // Celebration
        triggerNeonCelebration,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};

