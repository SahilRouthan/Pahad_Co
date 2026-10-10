import React from 'react';
import { Palette, Award, CheckCircle2, Handshake, Sparkles, Mountain, ShieldCheck } from 'lucide-react';
import { WHY_CHOOSE_ITEMS } from '../data/mockData';
import { BotanicalFlourish } from './common/BotanicalFlourish';

export const WhyChooseUs: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Palette':
        return <Palette className="w-6 h-6 text-pahad-green" />;
      case 'Award':
        return <Award className="w-6 h-6 text-pahad-green" />;
      case 'CheckCircle2':
        return <CheckCircle2 className="w-6 h-6 text-pahad-green" />;
      case 'Handshake':
        return <Handshake className="w-6 h-6 text-pahad-green" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-pahad-green" />;
      default:
        return <Sparkles className="w-6 h-6 text-pahad-green" />;
    }
  };

  return (
    <section id="about" className="py-20 md:py-28 bg-[#FBF6F0] relative border-t border-[#D9BB87]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#879B86]/20 border border-[#879B86]/40 text-pahad-green text-xs font-semibold uppercase tracking-wider mb-3">
            <span>The PAHAD Standard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-pahad-green mb-4">
            Why Choose PAHAD.co?
          </h2>
          <BotanicalFlourish variant="divider" />
          <p className="text-lg text-pahad-charcoal/80 font-normal">
            Rooted in the calm majesty of Dehradun, we combine deep regional expertise with world-class event production standards.
          </p>
        </div>

        {/* 5 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {WHY_CHOOSE_ITEMS.map((item, index) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-[#D9BB87]/30 shadow-subtle hover:shadow-premium hover:border-pahad-gold transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Top Number indicator */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#879B86]/15 group-hover:bg-pahad-green/10 flex items-center justify-center transition-colors">
                    {getIcon(item.iconName)}
                  </div>
                  <span className="font-serif italic text-lg text-pahad-gold-dark/60 font-semibold">
                    0{index + 1}
                  </span>
                </div>

                {/* Subtitle Highlight */}
                <span className="text-[11px] font-semibold uppercase tracking-wider text-pahad-gold-dark block mb-1">
                  {item.highlight}
                </span>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-serif font-bold text-pahad-green mb-3 group-hover:text-pahad-green-hover transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-pahad-charcoal/75 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom decorative line */}
              <div className="pt-4 mt-4 border-t border-[#D9BB87]/20 flex items-center gap-1.5 text-[11px] text-pahad-sage-dark font-medium">
                <Mountain className="w-3 h-3 text-pahad-gold" />
                <span>Uttarakhand Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Credibility & Ethos Banner */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-[#D9BB87]/40 shadow-subtle max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-pahad-green/10 flex items-center justify-center text-pahad-green shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-pahad-green">
                Transparent & Dependable Planning
              </h4>
              <p className="text-xs sm:text-sm text-pahad-charcoal/75">
                Clear vendor agreements, transparent cost structures, and dedicated single-point accountability.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-semibold text-pahad-green uppercase tracking-wider py-1.5 px-3 rounded-full bg-pahad-green/10">
              Dehradun Studio
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
