import React from 'react';
import { MessageSquareText, Compass, Hammer, PartyPopper, ArrowRight } from 'lucide-react';
import { PROCESS_STEPS } from '../data/mockData';
import { BotanicalFlourish } from './common/BotanicalFlourish';

interface OurProcessProps {
  onPlanEventClick: () => void;
}

export const OurProcess: React.FC<OurProcessProps> = ({ onPlanEventClick }) => {
  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquareText':
        return <MessageSquareText className="w-6 h-6 text-pahad-green" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-pahad-green" />;
      case 'Hammer':
        return <Hammer className="w-6 h-6 text-pahad-green" />;
      case 'PartyPopper':
        return <PartyPopper className="w-6 h-6 text-pahad-green" />;
      default:
        return <Compass className="w-6 h-6 text-pahad-green" />;
    }
  };

  return (
    <section className="py-20 md:py-28 bg-[#FFF0E1] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#879B86]/20 border border-[#879B86]/40 text-pahad-green text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Seamless Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-pahad-green mb-4">
            From Your Vision to a Beautiful Reality
          </h2>
          <BotanicalFlourish variant="divider" />
          <p className="text-lg text-pahad-charcoal/80 font-normal">
            A structured, collaborative approach designed to make event planning effortless and joyous for you.
          </p>
        </div>

        {/* Desktop Horizontal Timeline (Visible on lg and above) */}
        <div className="hidden lg:block relative mb-16">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-[8%] right-[8%] -translate-y-8 h-[2px] bg-gradient-to-r from-pahad-green/20 via-pahad-gold to-pahad-green/20 z-0" />

          <div className="grid grid-cols-4 gap-8 relative z-10">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.number}
                className="bg-white rounded-3xl p-7 border border-[#D9BB87]/40 shadow-subtle hover:shadow-premium hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Step Top Badge with Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-pahad-cream group-hover:bg-pahad-green/10 flex items-center justify-center transition-colors border border-[#D9BB87]/30">
                      {getStepIcon(step.iconName)}
                    </div>
                    <span className="font-serif font-bold text-3xl text-pahad-gold-dark/40 group-hover:text-pahad-gold transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-pahad-green/80 block mb-1">
                    {step.step}
                  </span>

                  <h3 className="text-xl font-serif font-bold text-pahad-green mb-3">
                    {step.title}
                  </h3>

                  <p className="text-sm text-pahad-charcoal/80 leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D9BB87]/20">
                  <p className="text-xs text-pahad-sage-dark italic">
                    {step.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile / Tablet Vertical Timeline (Visible below lg) */}
        <div className="lg:hidden space-y-6 relative mb-12">
          {/* Vertical line indicator */}
          <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-gradient-to-b from-pahad-green/20 via-pahad-gold to-pahad-green/20" />

          {PROCESS_STEPS.map((step) => (
            <div key={step.number} className="relative flex items-start gap-4 sm:gap-6 pl-2">
              {/* Step indicator node */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-pahad-green text-[#FFF0E1] flex items-center justify-center font-serif font-bold text-sm sm:text-base shrink-0 border-2 border-white shadow-md z-10 mt-2">
                {step.number}
              </div>

              {/* Step Card Content */}
              <div className="flex-1 bg-white rounded-2xl p-5 sm:p-6 border border-[#D9BB87]/30 shadow-subtle">
                <span className="text-[11px] font-bold uppercase tracking-wider text-pahad-gold-dark block mb-1">
                  {step.step}
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-pahad-green mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-pahad-charcoal/80 leading-relaxed mb-3">
                  {step.description}
                </p>
                <div className="text-[11px] sm:text-xs text-pahad-sage-dark bg-[#FBF6F0] p-2.5 rounded-lg border border-[#D9BB87]/20">
                  {step.details}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Center Bottom Action */}
        <div className="text-center pt-6">
          <button
            onClick={onPlanEventClick}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-pahad-green text-[#FFF0E1] font-semibold text-sm hover:bg-pahad-green-hover shadow-subtle transition-all duration-300"
          >
            <span>Start Step 01 With Us</span>
            <ArrowRight className="w-4 h-4 text-pahad-gold" />
          </button>
        </div>

      </div>
    </section>
  );
};
