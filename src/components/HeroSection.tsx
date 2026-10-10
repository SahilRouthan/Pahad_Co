import React from 'react';
import { Calendar, Compass, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onPlanEventClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onPlanEventClick }) => {
  return (
    <section
      id="home"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-40 lg:pb-28 overflow-hidden bg-pahad-mesh"
    >
      {/* Mountain outline backdrop */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-25">
        <svg
          className="absolute -bottom-10 left-0 w-[160%] sm:w-full h-auto text-pahad-sage/30"
          viewBox="0 0 1440 320"
          fill="currentColor"
          preserveAspectRatio="none"
        >
          <path d="M0,192L60,181.3C120,171,240,149,360,165.3C480,181,600,235,720,224C840,213,960,139,1080,122.7C1200,107,1320,149,1380,170.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            {/* Mountain location badge */}
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#879B86]/20 border border-[#879B86]/40 text-pahad-green text-xs font-semibold uppercase tracking-widest mb-6">
              <MapPin className="w-3.5 h-3.5 text-pahad-green" />
              <span>Dehradun • Mussoorie • Rishikesh</span>
            </div>

            {/* Small introductory uppercase tag */}
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[1px] w-8 bg-pahad-gold" />
              <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-pahad-gold-dark font-sans">
                CRAFTING EXTRAORDINARY EXPERIENCES
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-serif font-bold text-pahad-green leading-[1.12] mb-6 tracking-tight">
              You Dream It, <br />
              <span className="italic font-normal font-serif text-[#085A3C]">
                We Make It{' '}
              </span>
              <span className="relative inline-block text-pahad-green underline decoration-pahad-gold/60 decoration-wavy decoration-1 underline-offset-8">
                Extraordinary.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-pahad-charcoal/85 leading-relaxed max-w-xl mb-8 font-normal">
              At <strong className="font-semibold text-pahad-green">PAHAD.co</strong>, we turn your special moments into unforgettable experiences. From planning to perfection, we handle every detail so you can enjoy every moment.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
              <button
                onClick={onPlanEventClick}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-pahad-green text-[#FFF0E1] font-semibold text-base shadow-premium hover:bg-pahad-green-hover transition-all duration-300 transform hover:-translate-y-0.5 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pahad-green"
              >
                <Calendar className="w-5 h-5 text-pahad-gold group-hover:rotate-12 transition-transform duration-300" />
                <span>Plan Your Event</span>
              </button>

              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/70 hover:bg-white text-pahad-green border border-[#D9BB87]/50 font-medium text-base shadow-subtle hover:shadow-md transition-all duration-300 text-center"
              >
                <span>Explore Our Services</span>
                <Compass className="w-4 h-4 text-pahad-sage-dark" />
              </a>
            </div>

            {/* Trust Statement */}
            <div className="pt-6 border-t border-[#D9BB87]/30 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-pahad-charcoal/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-pahad-green" />
                <span className="font-medium">Thoughtfully Planned.</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pahad-gold-dark" />
                <span className="font-medium">Beautifully Executed.</span>
              </div>
              <div className="text-pahad-sage-dark font-medium italic hidden sm:inline">
                “Memories that last forever”
              </div>
            </div>
          </div>

          {/* Right Column: Photography Showcase with Himalayan Destination Aesthetic */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Luxury Main Wedding Visual */}
              <div className="relative rounded-2xl overflow-hidden shadow-premium border-2 border-white/80 bg-white group">
                <div className="aspect-[4/3] sm:aspect-[16/11] overflow-hidden">
                  <img
                    src="/hero-wedding.jpg"
                    alt="Luxury mountain destination wedding mandap setup in Uttarakhand overlooking Himalayas by PAHAD.co"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="eager"
                  />
                </div>
                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-pahad-green-dark/80 via-transparent to-black/10" />

                {/* Overlaid caption badge */}
                <div className="absolute bottom-4 left-4 right-4 p-3 sm:p-4 rounded-xl bg-white/90 backdrop-blur-md border border-[#D9BB87]/40 shadow-subtle flex items-center justify-between">
                  <div>
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-pahad-green block">
                      Himalayan Destination Wedding
                    </span>
                    <h2 className="text-sm sm:text-base font-serif font-bold text-pahad-charcoal">
                      Mussoorie Ridge Ceremony
                    </h2>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-pahad-green/10 text-pahad-green font-medium">
                    Uttarakhand
                  </span>
                </div>
              </div>

              {/* Supporting 4-Image Grid below */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 mt-3">
                {/* 1. Mandap Setup */}
                <div className="group relative rounded-xl overflow-hidden shadow-subtle border border-white/80 aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80"
                    alt="Floral wedding mandap setup"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-pahad-green/30 group-hover:bg-transparent transition-colors" />
                  <span className="absolute bottom-1 left-1 right-1 text-[9px] sm:text-[10px] text-white font-medium bg-black/60 backdrop-blur-xs text-center py-0.5 rounded">
                    Mandap
                  </span>
                </div>

                {/* 2. Corporate Summit */}
                <div className="group relative rounded-xl overflow-hidden shadow-subtle border border-white/80 aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80"
                    alt="Corporate event production in Rishikesh"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-pahad-green/30 group-hover:bg-transparent transition-colors" />
                  <span className="absolute bottom-1 left-1 right-1 text-[9px] sm:text-[10px] text-white font-medium bg-black/60 backdrop-blur-xs text-center py-0.5 rounded">
                    Corporate
                  </span>
                </div>

                {/* 3. Birthday Celebration */}
                <div className="group relative rounded-xl overflow-hidden shadow-subtle border border-white/80 aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80"
                    alt="Birthday milestone celebration setup"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-pahad-green/30 group-hover:bg-transparent transition-colors" />
                  <span className="absolute bottom-1 left-1 right-1 text-[9px] sm:text-[10px] text-white font-medium bg-black/60 backdrop-blur-xs text-center py-0.5 rounded">
                    Birthday
                  </span>
                </div>

                {/* 4. Elegant Dinner Setup */}
                <div className="group relative rounded-xl overflow-hidden shadow-subtle border border-white/80 aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=400&q=80"
                    alt="Candlelight dinner arrangement in pine woods"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-pahad-green/30 group-hover:bg-transparent transition-colors" />
                  <span className="absolute bottom-1 left-1 right-1 text-[9px] sm:text-[10px] text-white font-medium bg-black/60 backdrop-blur-xs text-center py-0.5 rounded">
                    Banquet
                  </span>
                </div>
              </div>

              {/* Floating Decorative Gold Badge */}
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-premium border border-[#D9BB87]/50 max-w-[170px] hidden sm:block animate-pulse duration-1000">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-pahad-gold/20 flex items-center justify-center text-pahad-gold-dark">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-bold text-pahad-green uppercase tracking-wider">
                    Uttarakhand
                  </span>
                </div>
                <p className="text-[10px] text-pahad-charcoal/80 leading-tight">
                  100% Bespoke Mountain Event Design
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
