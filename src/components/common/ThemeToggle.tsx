import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  variant?: 'pill' | 'icon' | 'compact';
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'icon',
  className = '',
  showLabel = false
}) => {
  const { isDark, toggleTheme } = useTheme();

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pahad-gold/60 select-none ${
          isDark
            ? 'bg-[#0B4636] border-[#D9B477]/40 text-[#FFF3E5] hover:bg-[#0E5240] hover:border-[#D9B477]'
            : 'bg-white/80 border-[#D9BB87]/50 text-pahad-green hover:bg-white hover:border-pahad-gold'
        } ${className}`}
      >
        <div className="relative w-4 h-4 flex items-center justify-center overflow-hidden">
          <Sun
            className={`w-4 h-4 text-[#D9B477] transition-all duration-500 absolute ${
              isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
            }`}
          />
          <Moon
            className={`w-4 h-4 text-pahad-green transition-all duration-500 absolute ${
              isDark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
            }`}
          />
        </div>
        {showLabel && (
          <span className="text-xs font-semibold tracking-wide capitalize">
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </span>
        )}
      </button>
    );
  }

  // Default 'icon' & 'compact' luxury button
  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Activate Light Mode' : 'Activate Luxury Dark Mode'}
      className={`relative p-2 rounded-full border transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-pahad-gold/60 focus:ring-offset-1 select-none group ${
        isDark
          ? 'bg-[#0B4636]/90 hover:bg-[#0E5240] border-[#D9B477]/40 hover:border-[#D9B477] text-[#D9B477] shadow-sm'
          : 'bg-white/70 hover:bg-white border-[#D9BB87]/50 hover:border-pahad-gold text-pahad-green shadow-xs'
      } ${className}`}
    >
      <div className="relative w-4 h-4 sm:w-[18px] sm:h-[18px] flex items-center justify-center">
        {/* Sun Icon for Light switch */}
        <Sun
          className={`w-full h-full text-[#D9B477] transition-all duration-500 transform ${
            isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          }`}
        />
        {/* Moon Icon for Dark switch */}
        <Moon
          className={`w-full h-full text-pahad-green transition-all duration-500 transform absolute ${
            isDark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        />
      </div>
      <span className="sr-only">
        {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </span>
    </button>
  );
};
