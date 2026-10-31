import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocial } from '../../context/SocialContext';
import { Logo } from '../common/Logo';
import { Avatar } from '../common/Avatar';
import {
  Home,
  Compass,
  Film,
  MessageSquare,
  Bell,
  Bookmark,
  User,
  PlusCircle,
  LogOut,
  ChevronUp,
  Sparkles,
  Users,
  Settings
} from 'lucide-react';
import { ActiveTab } from '../../types';

export const Sidebar: React.FC = () => {
  const { currentUser, logout, switchDemoUser, allDemoUsers } = useAuth();
  const {
    activeTab,
    setActiveTab,
    unreadNotificationsCount,
    conversations,
    setIsCreatePostOpen,
    setIsEditProfileOpen,
    setActiveProfileId,
  } = useSocial();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const totalUnreadMessages = conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'feed', label: 'Home Feed', icon: <Home className="w-5 h-5" /> },
    { id: 'explore', label: 'Explore', icon: <Compass className="w-5 h-5" /> },
    { id: 'reels', label: 'Reels', icon: <Film className="w-5 h-5" /> },
    {
      id: 'messages',
      label: 'Direct Messages',
      icon: <MessageSquare className="w-5 h-5" />,
      badge: totalUnreadMessages > 0 ? totalUnreadMessages : undefined,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
    { id: 'saved', label: 'Saved Posts', icon: <Bookmark className="w-5 h-5" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="w-5 h-5" /> },
  ];

  const handleNavClick = (id: ActiveTab) => {
    if (id === 'profile') {
      setActiveProfileId(currentUser.id);
    }
    setActiveTab(id);
  };

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 h-screen sticky top-0 bg-[#0B0B0F]/90 backdrop-blur-xl border-r border-white/5 px-4 py-6 z-40 select-none">
      {/* Top Header & Brand */}
      <div className="flex flex-col gap-8">
        <div
          onClick={() => setActiveTab('feed')}
          className="cursor-pointer px-2 transition-transform hover:scale-102 duration-300"
        >
          <Logo size="md" showText={true} showTagline={true} />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 font-medium text-sm group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00D9FF]/15 via-[#9B59FF]/15 to-transparent text-white border border-[#00D9FF]/30 shadow-[0_0_18px_rgba(0,217,255,0.2)]'
                    : 'text-[#A0A0AA] hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`transition-colors duration-300 ${
                      isActive ? 'text-[#00D9FF] filter drop-shadow-[0_0_8px_#00D9FF]' : 'group-hover:text-white'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className="tracking-wide">{item.label}</span>
                </div>

                {/* Badge indicator */}
                {Boolean(item.badge) && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-gradient-to-r from-[#FF258A] to-[#9B59FF] text-white shadow-[0_0_10px_#FF258A]">
                    {item.badge}
                  </span>
                )}

                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Create Post Glow Action Button */}
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="relative group overflow-hidden w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#00D9FF] via-[#287BFF] to-[#FF258A] text-white font-semibold text-sm tracking-wide shadow-[0_0_25px_rgba(0,217,255,0.35)] hover:shadow-[0_0_35px_rgba(255,37,138,0.5)] transition-all duration-300 active:scale-98"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <PlusCircle className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:rotate-90" />
          <span className="relative z-10 font-bold">Create Post</span>
        </button>
      </div>

      {/* Bottom Profile Pill & Switcher Menu */}
      <div className="relative" ref={userMenuRef}>
        {/* Dropdown Menu */}
        {isUserMenuOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-3 glass-dropdown rounded-2xl p-2.5 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] z-50 animate-slide-in">
            <div className="px-3 py-2 border-b border-white/5 mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#A0A0AA] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#00D9FF]" />
                Switch Demo Creator
              </span>
              <span className="text-[10px] text-[#00D9FF] bg-[#00D9FF]/10 px-1.5 py-0.5 rounded font-mono">1-Click</span>
            </div>

            {/* Quick Demo Switcher list */}
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto no-scrollbar">
              {allDemoUsers.map(user => {
                const isSelected = user.id === currentUser.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchDemoUser(user.id);
                      setIsUserMenuOpen(false);
                    }}
                    className={`flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                      isSelected ? 'bg-white/10 text-white' : 'text-[#A0A0AA] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Avatar src={user.avatarUrl} alt={user.fullName} size="xs" isVerified={user.isVerified} />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
                        <p className="text-[11px] text-[#A0A0AA] truncate">@{user.username}</p>
                      </div>
                    </div>
                    {isSelected && <Sparkles className="w-3.5 h-3.5 text-[#00D9FF] shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-white/5 mt-2 pt-1 flex flex-col gap-1">
              <button
                onClick={() => {
                  setIsEditProfileOpen(true);
                  setIsUserMenuOpen(false);
                }}
                className="flex items-center gap-2.5 w-full p-2 text-xs font-medium text-[#A0A0AA] hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                <Settings className="w-4 h-4 text-[#9B59FF]" />
                Edit Profile Settings
              </button>
              <button
                onClick={() => {
                  logout();
                  setIsUserMenuOpen(false);
                }}
                className="flex items-center gap-2.5 w-full p-2 text-xs font-medium text-[#FF258A] hover:bg-[#FF258A]/10 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Current User Pill */}
        <div
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center justify-between p-2.5 rounded-2xl bg-[#121218] border border-white/5 hover:border-white/15 cursor-pointer transition-all duration-300 group"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              size="sm"
              isOnline={true}
              isVerified={currentUser.isVerified}
            />
            <div className="truncate">
              <p className="text-xs font-bold text-white group-hover:text-[#00D9FF] transition-colors truncate">
                {currentUser.fullName}
              </p>
              <p className="text-[11px] text-[#A0A0AA] truncate">@{currentUser.username}</p>
            </div>
          </div>
          <ChevronUp
            className={`w-4 h-4 text-[#A0A0AA] transition-transform duration-300 ${
              isUserMenuOpen ? 'rotate-180 text-white' : ''
            }`}
          />
        </div>
      </div>
    </aside>
  );
};

