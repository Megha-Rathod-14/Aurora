import React from 'react';
import { Heart } from 'lucide-react';

interface DoubleTapHeartProps {
  show: boolean;
}

export const DoubleTapHeart: React.FC<DoubleTapHeartProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
      <div className="relative flex items-center justify-center animate-heart-pop">
        {/* Glowing backdrop circle */}
        <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-[#FF258A] to-[#00D9FF] blur-xl opacity-80" />
        <Heart className="w-24 h-24 text-white fill-[#FF258A] filter drop-shadow-[0_0_20px_#FF258A]" />
      </div>
    </div>
  );
};

