import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { img: 'w-7 h-7', text: 'text-lg', tagline: 'text-[9px]' },
    md: { img: 'w-10 h-10', text: 'text-2xl', tagline: 'text-[10px]' },
    lg: { img: 'w-14 h-14', text: 'text-3xl', tagline: 'text-xs' },
    xl: { img: 'w-20 h-20', text: 'text-4xl', tagline: 'text-sm' },
  };

  const { img, text, tagline } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Hummingbird Logo with subtle glowing aura */}
      <div className="relative group flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00D9FF]/30 via-[#9B59FF]/30 to-[#FF258A]/30 blur-md group-hover:blur-lg transition-all duration-300 opacity-80" />
        <img
          src="/aurora-logo.png"
          alt="Aurora Hummingbird"
          className={`relative z-10 ${img} object-contain filter drop-shadow-[0_0_12px_rgba(0,217,255,0.4)] transition-transform duration-300 group-hover:scale-105`}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-wider ${text} bg-gradient-to-r from-white via-[#00D9FF] to-[#FF258A] bg-clip-text text-transparent font-['Outfit']`}>
            AURORA
          </span>
          {showTagline && (
            <span className={`text-[#A0A0AA] tracking-widest uppercase font-medium ${tagline}`}>
              Connect. Create. Inspire.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

