import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { BUSINESS_INFO } from '../data/mockData';

export const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.phoneRaw}?text=${encodeURIComponent(
    BUSINESS_INFO.whatsappMessage
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip / Bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-pahad-charcoal text-xs font-semibold px-4 py-2 rounded-2xl shadow-premium border border-[#D9BB87]/40 animate-fade-in">
          <span>Chat with Dehradun Team</span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-pahad-charcoal/50 hover:text-pahad-charcoal"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="relative group w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-premium hover:shadow-2xl transform hover:scale-108 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        aria-label="Chat with PAHAD.co on WhatsApp"
        title="Chat with PAHAD.co on WhatsApp"
      >
        {/* Pulse effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 group-hover:opacity-0" />
        
        {/* WhatsApp Icon */}
        <MessageCircle className="w-7 h-7 relative z-10 fill-current" />
      </a>
    </div>
  );
};
