import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Flower2, 
  Users, 
  ShieldCheck, 
  Camera, 
  ArrowRight, 
  Check, 
  Sparkles,
  X
} from 'lucide-react';
import { SIGNATURE_SERVICES } from '../data/mockData';
import { SignatureService } from '../types';
import { BotanicalFlourish } from './common/BotanicalFlourish';

interface SignatureServicesProps {
  onSelectServiceForInquiry: (serviceTitle: string) => void;
}

export const SignatureServices: React.FC<SignatureServicesProps> = ({
  onSelectServiceForInquiry
}) => {
  const [activeModalService, setActiveModalService] = useState<SignatureService | null>(null);

  const getServiceIcon = (iconName: string, className = "w-6 h-6") => {
    switch (iconName) {
      case 'UtensilsCrossed':
        return <UtensilsCrossed className={className} />;
      case 'Flower2':
        return <Flower2 className={className} />;
      case 'Users':
        return <Users className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Camera':
        return <Camera className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <section id="services" className="py-20 md:py-28 bg-[#FBF6F0] dark:bg-[#083D30] relative border-y border-[#D9BB87]/30 dark:border-[#D9B477]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#879B86]/20 dark:bg-[#0B4636]/70 border border-[#879B86]/40 dark:border-[#D9B477]/30 text-pahad-green dark:text-[#D9B477] text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Flawless Execution</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-pahad-green dark:text-[#FFF3E5] mb-4">
            Our Signature Services
          </h2>
          <BotanicalFlourish variant="divider" />
          <p className="text-lg text-pahad-charcoal/80 dark:text-[#E8DFD3] font-normal">
            Every dimension of your event, orchestrated with mountain tranquility and surgical precision.
          </p>
        </div>

        {/* 5 Signature Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SIGNATURE_SERVICES.map((service, idx) => {
            const isFeatured = idx === 1; // Event decoration featured card

            return (
              <div
                key={service.id}
                className={`group relative bg-white dark:bg-[#0B4636] rounded-3xl p-7 border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                  isFeatured
                    ? 'border-pahad-gold dark:border-[#D9B477] shadow-premium ring-1 ring-pahad-gold/40 dark:ring-[#D9B477]/40'
                    : 'border-[#D9BB87]/30 dark:border-[#D9B477]/25 shadow-subtle hover:shadow-premium hover:-translate-y-1'
                }`}
              >
                {/* Top Corner accent ribbon if featured */}
                {isFeatured && (
                  <div className="absolute top-4 right-4 bg-pahad-green dark:bg-[#0B6B50] text-[#FFF0E1] text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                    Core Craft
                  </div>
                )}

                <div>
                  {/* Card Visual / Thumbnail */}
                  <div className="rounded-2xl overflow-hidden aspect-[16/10] mb-6 relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pahad-green-dark/70 dark:from-[#042720]/80 via-transparent to-transparent" />
                    
                    {/* Icon circle */}
                    <div className="absolute bottom-3 left-3 w-12 h-12 rounded-xl bg-white/95 dark:bg-[#083D30] backdrop-blur-md shadow-md border border-[#D9BB87]/40 dark:border-[#D9B477]/30 flex items-center justify-center text-pahad-green dark:text-[#D9B477]">
                      {getServiceIcon(service.iconName, 'w-6 h-6 text-pahad-green dark:text-[#D9B477]')}
                    </div>
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-pahad-green dark:text-[#FFF3E5] mb-3 group-hover:text-pahad-green-hover dark:group-hover:text-[#D9B477] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-pahad-charcoal/80 dark:text-[#E8DFD3]/80 leading-relaxed mb-6">
                    {service.shortDescription}
                  </p>

                  {/* Key Feature Bullets */}
                  <div className="space-y-2 mb-6">
                    {service.features.slice(0, 2).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-pahad-charcoal/85 dark:text-[#E8DFD3]/90">
                        <Check className="w-3.5 h-3.5 text-pahad-green dark:text-[#D9B477] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Row */}
                <div className="pt-5 border-t border-[#D9BB87]/30 dark:border-[#D9B477]/20 flex items-center justify-between">
                  <button
                    onClick={() => setActiveModalService(service)}
                    className="text-xs font-semibold text-pahad-green dark:text-[#D9B477] hover:text-pahad-green-light dark:hover:text-[#FFF3E5] flex items-center gap-1.5 transition-colors focus:outline-none"
                  >
                    <span>Learn More & Scope</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => onSelectServiceForInquiry(service.title)}
                    className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-[#879B86]/20 dark:bg-[#083D30] hover:bg-pahad-green dark:hover:bg-[#0B6B50] hover:text-white text-pahad-green dark:text-[#FFF3E5] transition-all"
                  >
                    Book Service
                  </button>
                </div>
              </div>
            );
          })}

          {/* 6th Card: Bespoke Full-Spectrum Hill Event Package */}
          <div className="relative bg-gradient-to-br from-pahad-green to-pahad-green-dark dark:from-[#0B4636] dark:to-[#042720] text-[#FFF0E1] rounded-3xl p-8 border border-pahad-gold/40 dark:border-[#D9B477]/40 shadow-premium flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFF0E1]/15 backdrop-blur-md flex items-center justify-center text-pahad-gold">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-pahad-gold">
                All-Inclusive Concierge
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#FFF0E1]">
                Complete Event Production
              </h3>
              <p className="text-sm text-[#FFF0E1]/80 leading-relaxed">
                Looking for end-to-end luxury management where every service is harmonized under a single dedicated wedding director? We take charge from Day 1 to post-event breakdown.
              </p>
            </div>

            <div className="pt-6 border-t border-[#FFF0E1]/20">
              <button
                onClick={() => onSelectServiceForInquiry('Full-Spectrum Complete Production')}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-pahad-gold text-pahad-green-dark font-semibold text-sm hover:bg-white transition-colors shadow-md"
              >
                <span>Inquire Full Package</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Service Detail Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#0B4636] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D9BB87]/50 dark:border-[#D9B477]/30 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-pahad-cream dark:bg-[#083D30] hover:bg-[#879B86]/20 dark:hover:bg-[#062F26] text-pahad-charcoal dark:text-[#FFF3E5] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-pahad-green/10 dark:bg-[#083D30] flex items-center justify-center text-pahad-green dark:text-[#D9B477] shrink-0">
                {getServiceIcon(activeModalService.iconName, 'w-7 h-7 text-pahad-green dark:text-[#D9B477]')}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-pahad-gold-dark dark:text-[#D9B477]">
                  PAHAD.co Signature Service
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-pahad-green dark:text-[#FFF3E5]">
                  {activeModalService.title}
                </h3>
              </div>
            </div>

            {/* Service Image Banner */}
            <div className="rounded-2xl overflow-hidden aspect-[16/9] mb-6 shadow-subtle border border-[#D9BB87]/30 dark:border-[#D9B477]/30">
              <img
                src={activeModalService.image}
                alt={activeModalService.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Detailed Description */}
            <p className="text-base text-pahad-charcoal/85 dark:text-[#E8DFD3]/90 leading-relaxed mb-6">
              {activeModalService.fullDescription}
            </p>

            {/* Features & Deliverables Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-[#FBF6F0] dark:bg-[#083D30]/80 p-5 rounded-2xl border border-[#D9BB87]/30 dark:border-[#D9B477]/25">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-pahad-green dark:text-[#FFF3E5] mb-3">
                  Key Capabilities
                </h4>
                <ul className="space-y-2">
                  {activeModalService.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-pahad-charcoal/80 dark:text-[#E8DFD3]/85">
                      <Check className="w-4 h-4 text-pahad-green dark:text-[#D9B477] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-pahad-green dark:text-[#FFF3E5] mb-3">
                  Deliverables
                </h4>
                <ul className="space-y-2">
                  {activeModalService.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-pahad-charcoal/80 dark:text-[#E8DFD3]/85">
                      <Sparkles className="w-3.5 h-3.5 text-pahad-gold-dark dark:text-[#D9B477] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Modal CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#D9BB87]/40 dark:border-[#D9B477]/25">
              <span className="text-xs text-pahad-charcoal/70 dark:text-[#A3B5A2]">
                Customized for your location in Dehradun & Uttarakhand hills.
              </span>
              <button
                onClick={() => {
                  const serviceName = activeModalService.title;
                  setActiveModalService(null);
                  onSelectServiceForInquiry(serviceName);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-pahad-green text-[#FFF0E1] text-sm font-semibold hover:bg-pahad-green-hover dark:hover:bg-[#0B6B50] transition-colors shadow-subtle flex items-center justify-center gap-2"
              >
                <span>Inquire About This Service</span>
                <ArrowRight className="w-4 h-4 text-pahad-gold" />
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
