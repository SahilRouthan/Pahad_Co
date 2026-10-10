import { Calendar, PhoneCall } from 'lucide-react';
import { BotanicalFlourish } from './common/BotanicalFlourish';
import { BUSINESS_INFO } from '../data/mockData';

interface ContactCTAProps {
  onPlanEventClick: () => void;
  onContactClick: () => void;
}

export const ContactCTA: React.FC<ContactCTAProps> = ({
  onPlanEventClick,
  onContactClick
}) => {
  return (
    <section className="relative py-20 md:py-28 bg-pahad-green overflow-hidden text-[#FFF0E1]">
      {/* Decorative ambient background rings and mountain peaks */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-10">
        <BotanicalFlourish variant="mountain-ridge" className="text-white absolute bottom-0 left-0" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-pahad-gold opacity-20" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border border-pahad-gold opacity-20" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Subtle Botanical Header Motif */}
        <div className="flex justify-center mb-4">
          <BotanicalFlourish variant="branch" color="#D9BB87" className="w-16 h-8 text-pahad-gold opacity-80" />
        </div>

        <span className="inline-block text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-pahad-gold mb-4">
          RESERVE YOUR EXTRAORDINARY MOMENT
        </span>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#FFF0E1] mb-6 leading-tight max-w-4xl mx-auto">
          Let’s Create Something <br className="hidden sm:inline" />
          <span className="italic font-normal font-serif text-pahad-gold">
            Extraordinary Together!
          </span>
        </h2>

        {/* Supporting Copy */}
        <p className="text-base sm:text-xl text-[#FFF0E1]/85 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Have an event in mind? Let’s make it unforgettable. From intimate Doon valley gatherings to royal Himalayan weddings, our team is ready to bring your dream to life.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={onPlanEventClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-pahad-gold text-pahad-green-dark font-bold text-base hover:bg-white hover:text-pahad-green transition-all duration-300 shadow-glow-gold transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-pahad-gold"
          >
            <Calendar className="w-5 h-5 text-pahad-green-dark" />
            <span>Plan Your Event</span>
          </button>

          <button
            onClick={onContactClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-transparent hover:bg-white/10 text-[#FFF0E1] border border-pahad-gold/60 font-semibold text-base transition-all duration-300 focus:outline-none"
          >
            <PhoneCall className="w-4 h-4 text-pahad-gold" />
            <span>Contact Us</span>
          </button>
        </div>

        {/* Quick Contact snippet */}
        <div className="mt-12 pt-8 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-[#FFF0E1]/80">
          <a
            href={`tel:${BUSINESS_INFO.phone}`}
            className="hover:text-pahad-gold transition-colors flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-pahad-gold inline-block" />
            <span>Direct Call: {BUSINESS_INFO.phone}</span>
          </a>
          <span className="hidden sm:inline opacity-40">•</span>
          <a
            href={`mailto:${BUSINESS_INFO.email}`}
            className="hover:text-pahad-gold transition-colors flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-pahad-gold inline-block" />
            <span>{BUSINESS_INFO.email}</span>
          </a>
          <span className="hidden sm:inline opacity-40">•</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pahad-gold inline-block" />
            <span>Dehradun, Uttarakhand</span>
          </span>
        </div>

      </div>
    </section>
  );
};
