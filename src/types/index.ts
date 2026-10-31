export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  website?: string;
  location?: string;
  isVerified?: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  isOnline?: boolean;
  lastSeen?: string;
  joinedDate?: string;
}

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  user: UserProfile;
  content: string;
  likesCount: number;
  isLiked?: boolean;
  createdAt: string;
  replies?: PostComment[];
}

export interface Post {
  id: string;
  userId: string;
  user: UserProfile;
  mediaUrls: string[];
  mediaType: 'image' | 'video' | 'carousel';
  caption: string;
  hashtags: string[];
  location?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  comments?: PostComment[];
}

export interface Story {
  id: string;
  userId: string;
  user: UserProfile;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  createdAt: string;
  expiresAt: string;
  viewers: UserProfile[];
  isViewed: boolean;
}

export interface Reel {
  id: string;
  userId: string;
  user: UserProfile;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  musicTitle: string;
  musicArtist: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participant: UserProfile; // The other user in 1-on-1
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  messages: ChatMessage[];
  isTyping?: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  actor: UserProfile;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'story_view';
  postId?: string;
  postMediaUrl?: string;
  commentText?: string;
  isRead: boolean;
  createdAt: string;
}

export type ActiveTab = 'feed' | 'explore' | 'reels' | 'messages' | 'notifications' | 'profile' | 'saved';

