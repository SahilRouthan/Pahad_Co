import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface MountainLogoProps {
  variant?: 'dark' | 'light' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const MountainLogo: React.FC<MountainLogoProps> = ({
  variant = 'auto',
  size = 'md',
  showSubtitle = true
}) => {
  let isSiteDark = false;
  try {
    const themeContext = useTheme();
    isSiteDark = themeContext.isDark;
  } catch {
    // If rendered outside ThemeProvider
    isSiteDark = false;
  }

  // Determines if the logo text should be dark green (for light backgrounds) or cream (for dark backgrounds)
  const isDarkText = variant === 'auto' ? !isSiteDark : variant === 'dark';

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
            stroke="#D9B477"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            className="opacity-70"
          />
          {/* Mountain Peaks with gold and forest green */}
          <path
            d="M8 35L21 16L30 28L36 21L42 35H8Z"
            fill={isDarkText ? 'url(#greenGradient)' : 'url(#goldGradientDarkTheme)'}
            opacity="0.95"
          />
          {/* Main Peak Highlight */}
          <path
            d="M21 16L27 28L21 35L16 28L21 16Z"
            fill="#D9B477"
            opacity="0.8"
          />
          {/* Valley river / path accent */}
          <path
            d="M21 31L23 35M25 33L27 35"
            stroke={isDarkText ? '#FFF0E1' : '#042720'}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          
          <defs>
            <linearGradient id="greenGradient" x1="24" y1="16" x2="24" y2="35" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0B6B50" />
              <stop offset="1" stopColor="#064E3B" />
            </linearGradient>
            <linearGradient id="goldGradientDarkTheme" x1="24" y1="16" x2="24" y2="35" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F2E2C4" />
              <stop offset="1" stopColor="#D9B477" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span
            className={`font-serif font-bold tracking-tight ${currentSize.title} ${
              isDarkText ? 'text-pahad-green' : 'text-[#FFF3E5]'
            }`}
          >
            PAHAD
          </span>
          <span
            className={`font-serif italic font-semibold ${
              isDarkText ? 'text-pahad-gold-dark' : 'text-pahad-gold'
            } ml-0.5 text-xl`}
          >
            .co
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`font-sans uppercase font-medium mt-0.5 ${currentSize.sub} ${
              isDarkText ? 'text-pahad-charcoal/70' : 'text-[#FFF3E5]/80'
            }`}
          >
            EVENTS • EXPERIENCES • MEMORIES
          </span>
        )}
      </div>
    </div>
  );
};
