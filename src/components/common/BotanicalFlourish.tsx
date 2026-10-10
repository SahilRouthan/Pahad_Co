import React from 'react';

interface BotanicalFlourishProps {
  className?: string;
  variant?: 'branch' | 'divider' | 'crest' | 'mountain-ridge';
  color?: string;
}

export const BotanicalFlourish: React.FC<BotanicalFlourishProps> = ({
  className = '',
  variant = 'divider',
  color = '#D9BB87'
}) => {
  if (variant === 'divider') {
    return (
      <div className={`flex items-center justify-center gap-3 my-4 ${className}`}>
        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#D9BB87]" />
        <svg
          width="24"
          height="14"
          viewBox="0 0 24 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#D9BB87]"
        >
          <path
            d="M12 2C8 6 4 7 1 7C4 7 8 8 12 12C16 8 20 7 23 7C20 7 16 6 12 2Z"
            stroke={color}
            strokeWidth="1.2"
            fill="none"
          />
          <circle cx="12" cy="7" r="1.5" fill={color} />
        </svg>
        <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#D9BB87]" />
      </div>
    );
  }

  if (variant === 'mountain-ridge') {
    return (
      <svg
        viewBox="0 0 1200 120"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full ${className}`}
      >
        <path
          d="M0 100L140 60L280 85L450 30L590 75L720 40L880 80L1020 45L1200 95V120H0V100Z"
          fill="currentColor"
          opacity="0.08"
        />
        <path
          d="M0 110L220 75L400 90L610 50L800 85L980 65L1200 105V120H0V110Z"
          fill="currentColor"
          opacity="0.05"
        />
      </svg>
    );
  }

  if (variant === 'branch') {
    return (
      <svg
        width="60"
        height="30"
        viewBox="0 0 60 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          d="M2 15C18 15 35 12 58 8"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M14 15C13 11 15 8 19 8C19 11 17 14 14 15Z"
          fill={color}
          opacity="0.7"
        />
        <path
          d="M26 14C27 18 29 20 33 19C32 16 29 14 26 14Z"
          fill={color}
          opacity="0.7"
        />
        <path
          d="M38 12C37 7 40 5 44 6C43 9 41 11 38 12Z"
          fill={color}
          opacity="0.7"
        />
        <path
          d="M48 10C50 14 53 15 56 13C54 11 51 9 48 10Z"
          fill={color}
          opacity="0.7"
        />
      </svg>
    );
  }

  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="16" cy="16" r="14" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
      <path d="M16 6L20 16L16 26L12 16L16 6Z" fill={color} opacity="0.4" />
      <circle cx="16" cy="16" r="2.5" fill={color} />
    </svg>
  );
};
