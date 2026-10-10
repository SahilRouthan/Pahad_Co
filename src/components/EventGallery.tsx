import { useState } from 'react';
import { MapPin, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/mockData';
import { GalleryItem } from '../types';
import { BotanicalFlourish } from './common/BotanicalFlourish';

export const EventGallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Weddings', 'Ceremonies', 'Corporate', 'Dinners', 'Birthdays'];

  const filteredItems = activeFilter === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeFilter);

  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedPhoto(filteredItems[nextIndex]);
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedPhoto(filteredItems[prevIndex]);
  };

  return (
    <section id="gallery" className="py-20 md:py-28 bg-[#FFF0E1] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#879B86]/20 border border-[#879B86]/40 text-pahad-green text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Visual Portfolio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-pahad-green mb-4">
            Moments We Make Memorable
          </h2>
          <BotanicalFlourish variant="divider" />
          <p className="text-lg text-pahad-charcoal/80 font-normal">
            A glimpse into the celebrations, vows, and gatherings we have brought to life across the majestic peaks and valleys of Uttarakhand.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none ${
                  isActive
                    ? 'bg-pahad-green text-[#FFF0E1] shadow-subtle'
                    : 'bg-white/80 hover:bg-white text-pahad-charcoal/80 border border-[#D9BB87]/40 hover:border-pahad-gold'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Editorial Masonry-Style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => {
            // Give specific items visual rhythm
            const isTall = index % 3 === 0;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedPhoto(item)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-white border border-[#D9BB87]/30 shadow-subtle hover:shadow-premium transition-all duration-500 transform hover:-translate-y-1.5 ${
                  isTall ? 'sm:row-span-2' : ''
                }`}
              >
                <div className={`w-full overflow-hidden ${isTall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                </div>

                {/* Overlaid Hover Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-pahad-green-dark/90 via-pahad-green-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                  
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-pahad-gold text-pahad-green-dark text-[10px] font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <h3 className="font-serif font-bold text-lg leading-snug mb-1 text-white">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-white/80">
                      <MapPin className="w-3 h-3 text-pahad-gold shrink-0" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                </div>

                {/* Persistent Mobile Bottom Label (always visible on touch devices) */}
                <div className="p-3 bg-white border-t border-[#D9BB87]/20 sm:hidden flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-sm text-pahad-green truncate">
                      {item.title}
                    </h3>
                    <span className="text-[11px] text-pahad-charcoal/60">
                      {item.location}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-pahad-gold-dark uppercase">
                    {item.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          {/* Close button */}
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-20 focus:outline-none"
            aria-label="Close photo preview"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevPhoto();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all z-20 focus:outline-none"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextPhoto();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all z-20 focus:outline-none"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image & Caption Box */}
          <div
            className="relative max-w-4xl w-full bg-pahad-green-dark rounded-3xl overflow-hidden shadow-2xl border border-pahad-gold/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-[70vh] overflow-hidden flex items-center justify-center bg-black/40">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>

            <div className="p-6 bg-pahad-green text-[#FFF0E1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-pahad-gold text-pahad-green-dark">
                    {selectedPhoto.category}
                  </span>
                  <span className="text-xs text-pahad-gold flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedPhoto.location}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#FFF0E1]/80 mt-1 max-w-xl">
                  {selectedPhoto.caption}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-[#FFF0E1]/60 font-medium">
                  PAHAD.co Archives
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
