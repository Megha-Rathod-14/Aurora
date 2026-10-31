import React from 'react';
import { BadgeCheck } from 'lucide-react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  hasStory?: boolean;
  storyViewed?: boolean;
  isOnline?: boolean;
  isVerified?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  hasStory = false,
  storyViewed = false,
  isOnline = false,
  isVerified = false,
  onClick,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28',
  };

  const ringPadding = {
    xs: 'p-[1.5px]',
    sm: 'p-[2px]',
    md: 'p-[2.5px]',
    lg: 'p-[3px]',
    xl: 'p-[3.5px]',
    '2xl': 'p-[4px]',
  };

  const onlineDotSize = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${isClickable ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''} ${className}`}
    >
      {/* Outer Story Ring */}
      {hasStory ? (
        <div
          className={`rounded-full ${ringPadding[size]} ${
            storyViewed
              ? 'bg-[#2E2E3A]'
              : 'bg-gradient-to-tr from-[#00D9FF] via-[#9B59FF] to-[#FF258A] animate-pulse-glow shadow-[0_0_12px_rgba(0,217,255,0.4)]'
          }`}
        >
          <div className="bg-[#050505] p-[2px] rounded-full">
            <img
              src={src}
              alt={alt}
              className={`${sizeClasses[size]} rounded-full object-cover`}
              loading="lazy"
            />
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} rounded-full object-cover ring-1 ring-white/10`}
          loading="lazy"
        />
      )}

      {/* Online indicator */}
      {isOnline && (
        <span
          className={`absolute bottom-0 right-0 ${onlineDotSize[size]} rounded-full bg-[#00D9FF] ring-2 ring-[#0B0B0F] shadow-[0_0_8px_#00D9FF]`}
          title="Online now"
        />
      )}

      {/* Verified Badge */}
      {isVerified && (
        <div
          className="absolute -bottom-1 -right-1 bg-[#050505] rounded-full p-[1px] flex items-center justify-center"
          title="Verified Creator"
        >
          <BadgeCheck className="w-4 h-4 text-[#00D9FF] fill-[#00D9FF]/20" />
        </div>
      )}
    </div>
  );
};

