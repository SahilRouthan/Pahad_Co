import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  Cake, 
  Briefcase, 
  GraduationCap, 
  GlassWater, 
  Compass, 
  ArrowUpRight
} from 'lucide-react';
import { EVENT_CATEGORIES } from '../data/mockData';
import { BotanicalFlourish } from './common/BotanicalFlourish';

interface EventCategoriesProps {
  onSelectCategory: (categoryTitle: string) => void;
}

export const EventCategories: React.FC<EventCategoriesProps> = ({ onSelectCategory }) => {
  const [activeCategory, setActiveCategory] = useState<string>(EVENT_CATEGORIES[0].id);

  // Helper for dynamic icon rendering
  const getIcon = (iconName: string, className = "w-6 h-6") => {
    switch (iconName) {
      case 'Compass':
        return <Compass className={className} />;
      case 'HeartHandshake':
        return <HeartHandshake className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'Cake':
        return <Cake className={className} />;
      case 'GraduationCap':
        return <GraduationCap className={className} />;
      case 'GlassWater':
        return <GlassWater className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <section id="events" className="py-20 md:py-28 bg-[#FFF0E1] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#879B86]/20 border border-[#879B86]/40 text-pahad-green text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Specialized Curation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-pahad-green mb-4">
            Events We Specialize In
          </h2>
          <BotanicalFlourish variant="divider" />
          <p className="text-lg text-pahad-charcoal/80 font-normal">
            “Every occasion deserves to be extraordinary.”
          </p>
        </div>

        {/* Featured Hero Highlight Card for Destination Weddings (The signature specialty) */}
        {EVENT_CATEGORIES.length > 0 && (
          <div className="mb-12 bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-premium border border-[#D9BB87]/40 relative overflow-hidden group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1 rounded-full bg-pahad-green text-[#FFF0E1] text-xs font-semibold uppercase tracking-wider">
                    {EVENT_CATEGORIES[0].badge || 'Specialty'}
                  </span>
                  <span className="text-sm font-medium text-pahad-sage-dark flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-pahad-gold-dark" />
                    {EVENT_CATEGORIES[0].popularFor}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-pahad-green">
                  {EVENT_CATEGORIES[0].title}
                </h3>

                <p className="text-pahad-charcoal/80 text-base sm:text-lg leading-relaxed">
                  {EVENT_CATEGORIES[0].description}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => onSelectCategory(EVENT_CATEGORIES[0].title)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-pahad-green text-[#FFF0E1] text-sm font-semibold hover:bg-pahad-green-hover transition-colors shadow-subtle"
                  >
                    <span>Inquire for Destination Wedding</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-pahad-sage-dark italic">
                    Mussoorie • Dhanaulti • Rishikesh • Dehradun Valley
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden aspect-[16/10] shadow-md border border-[#D9BB87]/30">
                  <img
                    src={EVENT_CATEGORIES[0].image}
                    alt={EVENT_CATEGORIES[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6 Remaining Grid Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {EVENT_CATEGORIES.slice(1).map((cat) => {
            const isSelected = activeCategory === cat.id;

            return (
              <div
                key={cat.id}
                onMouseEnter={() => setActiveCategory(cat.id)}
                className={`group relative bg-white rounded-2xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'border-pahad-green/40 shadow-premium -translate-y-1'
                    : 'border-[#D9BB87]/30 shadow-subtle hover:shadow-premium hover:-translate-y-1 hover:border-pahad-gold'
                }`}
              >
                <div>
                  {/* Category Image Preview banner */}
                  <div className="rounded-xl overflow-hidden aspect-[16/9] mb-5 relative">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pahad-green-dark/70 via-transparent to-transparent" />
                    
                    {/* Icon Badge */}
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md shadow-sm border border-[#D9BB87]/40 flex items-center justify-center text-pahad-green">
                      {getIcon(cat.iconName, 'w-5 h-5 text-pahad-green')}
                    </div>

                    {/* Subtitle pill */}
                    <div className="absolute bottom-2.5 left-3">
                      <span className="text-[11px] font-medium tracking-wide uppercase text-white/90 bg-pahad-green-dark/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                        {cat.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-serif font-bold text-pahad-green group-hover:text-pahad-green-hover transition-colors">
                      {cat.title}
                    </h3>
                  </div>

                  <p className="text-sm text-pahad-charcoal/75 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 border-t border-[#D9BB87]/25 flex items-center justify-between">
                  <span className="text-xs text-pahad-sage-dark font-medium">
                    {cat.popularFor}
                  </span>
                  
                  <button
                    onClick={() => onSelectCategory(cat.title)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-pahad-green hover:text-pahad-green-hover group/btn py-1"
                    title={`Plan your ${cat.title}`}
                  >
                    <span>Plan This</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
