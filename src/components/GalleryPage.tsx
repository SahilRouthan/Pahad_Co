import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Filter,
  Camera
} from 'lucide-react';
import { GalleryImageItem } from '../types';
import { api } from '../utils/api';
import { BotanicalFlourish } from './common/BotanicalFlourish';
import { MountainLogo } from './common/MountainLogo';

interface GalleryPageProps {
  onBackToHome: () => void;
  onPlanEventClick: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onBackToHome,
  onPlanEventClick
}) => {
  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryImageItem | null>(null);

  const categories = ['All', 'Weddings', 'Ceremonies', 'Corporate', 'Dinners', 'Birthdays'];

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await api.gallery.getAll();
      if (res && res.data) {
        setImages(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch gallery images from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filteredImages = images.filter((img) => {
    const matchesCategory = activeCategory === 'All' || img.category === activeCategory;
    const matchesSearch = !searchTerm.trim() || 
      img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (img.caption && img.caption.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredImages.findIndex((item) => item.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedPhoto(filteredImages[nextIndex]);
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredImages.findIndex((item) => item.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedPhoto(filteredImages[prevIndex]);
  };

  return (
    <div className="min-h-screen bg-[#FFF0E1] text-[#202522] flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#FFF0E1]/95 backdrop-blur-md border-b border-[#D9BB87]/40 py-4 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-pahad-green hover:text-pahad-green-light transition-colors group focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          <div onClick={onBackToHome} className="cursor-pointer">
            <MountainLogo size="sm" showSubtitle={false} />
          </div>

          <button
            onClick={onPlanEventClick}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full bg-pahad-green text-[#FFF0E1] hover:bg-pahad-green-hover transition-colors shadow-subtle"
          >
            Plan Your Event
          </button>
        </div>
      </header>

      {/* Main Gallery Container */}
      <main className="flex-grow py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Title */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#879B86]/20 border border-[#879B86]/40 text-pahad-green text-xs font-semibold uppercase tracking-wider mb-3">
              <Camera className="w-3.5 h-3.5 text-pahad-gold-dark" />
              <span>PAHAD.co Visual Archives</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-pahad-green mb-3">
              Himalayan Celebrations Gallery
            </h1>
            <BotanicalFlourish variant="divider" />
            <p className="text-sm sm:text-base text-pahad-charcoal/80 max-w-xl mx-auto">
              Explore real weddings, sacred rituals, corporate retreats, and milestone evenings curated across Dehradun, Mussoorie, Kanatal, and Rishikesh.
            </p>
          </div>

          {/* Controls: Search & Category Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#D9BB87]/30">
            
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 focus:outline-none ${
                      isActive
                        ? 'bg-pahad-green text-[#FFF0E1] shadow-subtle'
                        : 'bg-white/80 hover:bg-white text-pahad-charcoal/80 border border-[#D9BB87]/40'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-pahad-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search location or theme..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-[#D9BB87]/50 focus:border-pahad-green bg-white/90 focus:outline-none focus:ring-2 focus:ring-pahad-green/30"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-pahad-charcoal/40 hover:text-pahad-charcoal text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

          {/* Gallery Items Grid */}
          {loading ? (
            <div className="text-center py-20 text-sm text-pahad-charcoal/60">
              Loading high-resolution gallery archives...
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20 bg-white/50 rounded-3xl border border-[#D9BB87]/30 p-8 max-w-md mx-auto">
              <Filter className="w-8 h-8 text-pahad-gold mx-auto mb-3" />
              <h3 className="font-serif font-bold text-lg text-pahad-green mb-1">
                No Photographs Found
              </h3>
              <p className="text-xs text-pahad-charcoal/70 mb-4">
                No gallery entries match "{searchTerm}" in category "{activeCategory}".
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('All');
                }}
                className="px-4 py-2 rounded-full bg-pahad-green text-[#FFF0E1] text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((img, idx) => {
                const isTall = idx % 3 === 0;

                return (
                  <div
                    key={img.id}
                    onClick={() => setSelectedPhoto(img)}
                    className={`group relative rounded-2xl overflow-hidden cursor-pointer bg-white border border-[#D9BB87]/30 shadow-subtle hover:shadow-premium transition-all duration-500 transform hover:-translate-y-1 ${
                      isTall ? 'sm:row-span-2' : ''
                    }`}
                  >
                    <div className={`w-full overflow-hidden ${isTall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
                      <img
                        src={img.image_url}
                        alt={img.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        loading="lazy"
                      />
                    </div>

                    {/* Overlaid Hover Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-pahad-green-dark/90 via-pahad-green-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                      <div className="transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-pahad-gold text-pahad-green-dark text-[10px] font-bold uppercase tracking-wider">
                            {img.category}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        <h3 className="font-serif font-bold text-lg leading-snug mb-1 text-white">
                          {img.title}
                        </h3>

                        <div className="flex items-center gap-1.5 text-xs text-white/80">
                          <MapPin className="w-3 h-3 text-pahad-gold shrink-0" />
                          <span>{img.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Persistent Mobile Bottom Label */}
                    <div className="p-3 bg-white border-t border-[#D9BB87]/20 sm:hidden flex items-center justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-sm text-pahad-green truncate">
                          {img.title}
                        </h3>
                        <span className="text-[11px] text-pahad-charcoal/60">
                          {img.location}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-pahad-gold-dark uppercase">
                        {img.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-20 focus:outline-none"
            aria-label="Close photo preview"
          >
            <X className="w-6 h-6" />
          </button>

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

          <div
            className="relative max-w-4xl w-full bg-pahad-green-dark rounded-3xl overflow-hidden shadow-2xl border border-pahad-gold/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-[70vh] overflow-hidden flex items-center justify-center bg-black/40">
              <img
                src={selectedPhoto.image_url}
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
                {selectedPhoto.caption && (
                  <p className="text-xs sm:text-sm text-[#FFF0E1]/80 mt-1 max-w-xl">
                    {selectedPhoto.caption}
                  </p>
                )}
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => {
                    setSelectedPhoto(null);
                    onPlanEventClick();
                  }}
                  className="px-5 py-2.5 rounded-full bg-pahad-gold text-pahad-green-dark text-xs font-bold hover:bg-white transition-colors"
                >
                  Inquire Similar Setup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
