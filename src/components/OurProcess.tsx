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
        return <MessageSquareText className="w-6 h-6 text-pahad-green dark:text-[#D9B477]" />;
      case 'Compass':
        return <Compass className="w-6 h-6 text-pahad-green dark:text-[#D9B477]" />;
      case 'Hammer':
        return <Hammer className="w-6 h-6 text-pahad-green dark:text-[#D9B477]" />;
      case 'PartyPopper':
        return <PartyPopper className="w-6 h-6 text-pahad-green dark:text-[#D9B477]" />;
      default:
        return <Compass className="w-6 h-6 text-pahad-green dark:text-[#D9B477]" />;
    }
  };

  return (
    <section className="py-20 md:py-28 bg-[#FFF0E1] dark:bg-[#062F26] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#879B86]/20 dark:bg-[#0B4636]/70 border border-[#879B86]/40 dark:border-[#D9B477]/30 text-pahad-green dark:text-[#D9B477] text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Seamless Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-pahad-green dark:text-[#FFF3E5] mb-4">
            From Your Vision to a Beautiful Reality
          </h2>
          <BotanicalFlourish variant="divider" />
          <p className="text-lg text-pahad-charcoal/80 dark:text-[#E8DFD3] font-normal">
            A structured, collaborative approach designed to make event planning effortless and joyous for you.
          </p>
        </div>

        {/* Desktop Horizontal Timeline (Visible on lg and above) */}
        <div className="hidden lg:block relative mb-16">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-[8%] right-[8%] -translate-y-8 h-[2px] bg-gradient-to-r from-pahad-green/20 dark:from-[#0B6B50]/30 via-pahad-gold dark:via-[#D9B477] to-pahad-green/20 dark:to-[#0B6B50]/30 z-0" />

          <div className="grid grid-cols-4 gap-8 relative z-10">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.number}
                className="bg-white dark:bg-[#0B4636] rounded-3xl p-7 border border-[#D9BB87]/40 dark:border-[#D9B477]/25 shadow-subtle hover:shadow-premium hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Step Top Badge with Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-pahad-cream dark:bg-[#083D30] group-hover:bg-pahad-green/10 dark:group-hover:bg-[#062F26] flex items-center justify-center transition-colors border border-[#D9BB87]/30 dark:border-[#D9B477]/20">
                      {getStepIcon(step.iconName)}
                    </div>
                    <span className="font-serif font-bold text-3xl text-pahad-gold-dark/40 dark:text-[#D9B477]/40 group-hover:text-pahad-gold dark:group-hover:text-[#D9B477] transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-pahad-green/80 dark:text-[#D9B477] block mb-1">
                    {step.step}
                  </span>

                  <h3 className="text-xl font-serif font-bold text-pahad-green dark:text-[#FFF3E5] mb-3">
                    {step.title}
                  </h3>

                  <p className="text-sm text-pahad-charcoal/80 dark:text-[#E8DFD3]/80 leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D9BB87]/20 dark:border-[#D9B477]/20">
                  <p className="text-xs text-pahad-sage-dark dark:text-[#A3B5A2] italic">
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
          <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-gradient-to-b from-pahad-green/20 dark:from-[#0B6B50]/30 via-pahad-gold dark:via-[#D9B477] to-pahad-green/20 dark:to-[#0B6B50]/30" />

          {PROCESS_STEPS.map((step) => (
            <div key={step.number} className="relative flex items-start gap-4 sm:gap-6 pl-2">
              {/* Step indicator node */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-pahad-green dark:bg-[#0B6B50] text-[#FFF0E1] flex items-center justify-center font-serif font-bold text-sm sm:text-base shrink-0 border-2 border-white dark:border-[#0B4636] shadow-md z-10 mt-2">
                {step.number}
              </div>

              {/* Step Card Content */}
              <div className="flex-1 bg-white dark:bg-[#0B4636] rounded-2xl p-5 sm:p-6 border border-[#D9BB87]/30 dark:border-[#D9B477]/25 shadow-subtle">
                <span className="text-[11px] font-bold uppercase tracking-wider text-pahad-gold-dark dark:text-[#D9B477] block mb-1">
                  {step.step}
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold text-pahad-green dark:text-[#FFF3E5] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-pahad-charcoal/80 dark:text-[#E8DFD3]/80 leading-relaxed mb-3">
                  {step.description}
                </p>
                <div className="text-[11px] sm:text-xs text-pahad-sage-dark dark:text-[#A3B5A2] bg-[#FBF6F0] dark:bg-[#083D30] p-2.5 rounded-lg border border-[#D9BB87]/20 dark:border-[#D9B477]/20">
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
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-pahad-green dark:bg-[#0B6B50] text-[#FFF0E1] font-semibold text-sm hover:bg-pahad-green-hover dark:hover:bg-[#108765] shadow-subtle transition-all duration-300"
          >
            <span>Start Step 01 With Us</span>
            <ArrowRight className="w-4 h-4 text-pahad-gold" />
          </button>
        </div>

      </div>
    </section>
  );
};
