import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocialProvider, useSocial } from './context/SocialContext';
import { Sidebar } from './components/navigation/Sidebar';
import { MobileNav } from './components/navigation/MobileNav';
import { MobileHeader } from './components/navigation/MobileHeader';
import { HomeFeed } from './components/feed/HomeFeed';
import { RightSidebar } from './components/feed/RightSidebar';
import { ExploreView } from './components/explore/ExploreView';
import { ReelsView } from './components/reels/ReelsView';
import { ChatView } from './components/chat/ChatView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { ProfileView } from './components/profile/ProfileView';
import { SavedPostsView } from './components/feed/SavedPostsView';
import { StoryViewerModal } from './components/stories/StoryViewerModal';
import { CreateStoryModal } from './components/stories/CreateStoryModal';
import { CreatePostModal } from './components/modals/CreatePostModal';
import { PostDetailModal } from './components/modals/PostDetailModal';
import { EditProfileModal } from './components/profile/EditProfileModal';
import { ShareModal } from './components/modals/ShareModal';
import { AuthModal } from './components/auth/AuthModal';
import { ToastContainer } from './components/common/ToastContainer';

const MainLayout: React.FC = () => {
  const { activeTab } = useSocial();
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row justify-center selection:bg-[#FF258A]/30 selection:text-[#00D9FF]">
      {/* 1. Mobile Top Header */}
      <MobileHeader />

      {/* 2. Desktop Floating Left Navigation Sidebar */}
      <Sidebar />

      {/* 3. Main Center Content Pane */}
      <main className="flex-1 flex justify-center w-full min-h-screen pb-20 md:pb-6 overflow-x-hidden">
        {activeTab === 'feed' && (
          <div className="w-full flex justify-center">
            <HomeFeed />
            <RightSidebar />
          </div>
        )}

        {activeTab === 'explore' && <ExploreView />}
        {activeTab === 'reels' && <ReelsView />}
        {activeTab === 'messages' && <ChatView />}
        {activeTab === 'notifications' && <NotificationsView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'saved' && <SavedPostsView />}
      </main>

      {/* 4. Mobile Bottom Navigation */}
      <MobileNav />

      {/* 5. Modals & Overlays */}
      <StoryViewerModal />
      <CreateStoryModal />
      <CreatePostModal />
      <PostDetailModal />
      <EditProfileModal />
      <ShareModal />
      <AuthModal
        isOpen={!isAuthenticated || isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* 6. Notifications Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SocialProvider>
        <MainLayout />
      </SocialProvider>
    </AuthProvider>
  );
}
