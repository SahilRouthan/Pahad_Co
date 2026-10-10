import React from 'react';

interface MountainLogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const MountainLogo: React.FC<MountainLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showSubtitle = true
}) => {
  const isDark = variant === 'dark';

  const sizeStyles = {
    sm: { icon: 'w-7 h-7', title: 'text-lg', sub: 'text-[9px] tracking-[0.25em]' },
    md: { icon: 'w-9 h-9', title: 'text-2xl', sub: 'text-[10px] tracking-[0.28em]' },
    lg: { icon: 'w-12 h-12', title: 'text-3xl', sub: 'text-xs tracking-[0.3em]' }
  };

  const currentSize = sizeStyles[size];

  return (
    <div className="flex items-center gap-3 group select-none">
      {/* Mountain Emblem SVG */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${currentSize.icon} transition-transform duration-300 group-hover:scale-105`}
        >
          {/* Subtle background sun/gold ring */}
          <circle
            cx="24"
            cy="24"
            r="22"
            stroke={isDark ? '#D9BB87' : '#D9BB87'}
            strokeWidth="1.2"
            strokeDasharray="2 2"
            className="opacity-60"
          />
          {/* Mountain Peaks with gold and forest green */}
          <path
            d="M8 35L21 16L30 28L36 21L42 35H8Z"
            fill={isDark ? 'url(#greenGradient)' : 'url(#goldGradientLight)'}
            opacity="0.95"
          />
          {/* Main Peak Highlight */}
          <path
            d="M21 16L27 28L21 35L16 28L21 16Z"
            fill="#D9BB87"
            opacity="0.75"
          />
          {/* Valley river / path accent */}
          <path
            d="M21 31L23 35M25 33L27 35"
            stroke={isDark ? '#FFF0E1' : '#064B32'}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          
          <defs>
            <linearGradient id="greenGradient" x1="24" y1="16" x2="24" y2="35" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0a6b47" />
              <stop offset="1" stopColor="#064B32" />
            </linearGradient>
            <linearGradient id="goldGradientLight" x1="24" y1="16" x2="24" y2="35" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F2E2C4" />
              <stop offset="1" stopColor="#D9BB87" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span
            className={`font-serif font-bold tracking-tight ${currentSize.title} ${
              isDark ? 'text-pahad-green' : 'text-[#FFF0E1]'
            }`}
          >
            PAHAD
          </span>
          <span
            className={`font-serif italic font-semibold ${
              isDark ? 'text-pahad-gold-dark' : 'text-pahad-gold'
            } ml-0.5 text-xl`}
          >
            .co
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`font-sans uppercase font-medium mt-0.5 ${currentSize.sub} ${
              isDark ? 'text-pahad-charcoal/70' : 'text-[#FFF0E1]/80'
            }`}
          >
            EVENTS • EXPERIENCES • MEMORIES
          </span>
        )}
      </div>
    </div>
  );
};
