import React from 'react';
import { useSocial } from '../../context/SocialContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import { Plus } from 'lucide-react';

export const StoriesBar: React.FC = () => {
  const { stories, setActiveStoryUserId, setIsCreateStoryOpen } = useSocial();
  const { currentUser } = useAuth();

  // Deduplicate stories by user
  const userStoryMap = new Map();
  stories.forEach(story => {
    if (!userStoryMap.has(story.userId)) {
      userStoryMap.set(story.userId, story);
    }
  });

  const uniqueUserStories = Array.from(userStoryMap.values());
  const currentUserStory = uniqueUserStories.find(s => s.userId === currentUser.id);
  const otherStories = uniqueUserStories.filter(s => s.userId !== currentUser.id);

  return (
    <div className="w-full bg-[#121218]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-4 mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1">
        {/* Current User Story Item */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 select-none">
          <div className="relative group cursor-pointer">
            {currentUserStory ? (
              <div onClick={() => setActiveStoryUserId(currentUser.id)}>
                <Avatar
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  size="lg"
                  hasStory={true}
                  storyViewed={currentUserStory.isViewed}
                />
              </div>
            ) : (
              <div onClick={() => setIsCreateStoryOpen(true)} className="relative">
                <Avatar
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  size="lg"
                  hasStory={false}
                />
                <button
                  className="absolute bottom-0 right-0 p-1 rounded-full bg-gradient-to-tr from-[#00D9FF] to-[#FF258A] text-white ring-2 ring-[#121218] shadow-[0_0_8px_#00D9FF] group-hover:scale-110 transition-transform"
                  title="Add to story"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            )}
          </div>
          <span className="text-xs font-medium text-[#A0A0AA] max-w-[68px] truncate">
            {currentUserStory ? 'Your Story' : 'Add Story'}
          </span>
        </div>

        {/* Other Users' Stories */}
        {otherStories.map(story => (
          <div
            key={story.id}
            onClick={() => setActiveStoryUserId(story.userId)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer select-none group"
          >
            <div className="transition-transform duration-300 group-hover:scale-105">
              <Avatar
                src={story.user.avatarUrl}
                alt={story.user.fullName}
                size="lg"
                hasStory={true}
                storyViewed={story.isViewed}
              />
            </div>
            <span className="text-xs font-medium text-white group-hover:text-[#00D9FF] transition-colors max-w-[68px] truncate">
              {story.user.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

