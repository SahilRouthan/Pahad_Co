import React from 'react';
import { Phone, Mail, Globe, Instagram, MapPin, ArrowUp } from 'lucide-react';
import { MountainLogo } from './common/MountainLogo';
import { BUSINESS_INFO, SIGNATURE_SERVICES } from '../data/mockData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-pahad-green-dark text-[#FFF0E1] pt-16 pb-12 border-t border-pahad-gold/30 relative overflow-hidden">
      {/* Decorative subtle mountain silhouette outline at top of footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#FFF0E1]/15">
          
          {/* Column 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <MountainLogo variant="light" size="md" />

            <p className="text-xs sm:text-sm text-[#FFF0E1]/80 leading-relaxed max-w-sm pt-2">
              PAHAD.co is a premier event planning and management business based in Dehradun, Uttarakhand. We craft extraordinary destination weddings, bespoke corporate retreats, and cherished milestone celebrations amidst the Himalayas.
            </p>

            <div className="pt-2">
              <span className="text-xs italic text-pahad-gold font-serif">
                “{BUSINESS_INFO.message}”
              </span>
            </div>
          </div>

          {/* Column 2: Quick Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-pahad-gold">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#home" className="text-[#FFF0E1]/80 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#services" className="text-[#FFF0E1]/80 hover:text-white transition-colors">
                  Our Services
                </a>
              </li>
              <li>
                <a href="#events" className="text-[#FFF0E1]/80 hover:text-white transition-colors">
                  Event Types
                </a>
              </li>
              <li>
                <a href="#about" className="text-[#FFF0E1]/80 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-[#FFF0E1]/80 hover:text-white transition-colors">
                  Event Gallery
                </a>
              </li>
              <li>
                <a href="#contact" className="text-[#FFF0E1]/80 hover:text-white transition-colors">
                  Plan Your Event
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Event Services (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-pahad-gold">
              Our Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {SIGNATURE_SERVICES.map((s) => (
                <li key={s.id}>
                  <a href="#services" className="text-[#FFF0E1]/80 hover:text-white transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
              <li>
                <a href="#events" className="text-pahad-gold/90 hover:text-white transition-colors font-medium">
                  Destination Wedding Concierge
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-pahad-gold">
              Get in Touch
            </h4>
            
            <ul className="space-y-3 text-xs sm:text-sm text-[#FFF0E1]/85">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-pahad-gold shrink-0 mt-0.5" />
                <span>{BUSINESS_INFO.location}</span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-pahad-gold shrink-0" />
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="hover:text-pahad-gold transition-colors font-medium"
                >
                  {BUSINESS_INFO.phone}
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-pahad-gold shrink-0" />
                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="hover:text-pahad-gold transition-colors"
                >
                  {BUSINESS_INFO.email}
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-pahad-gold shrink-0" />
                <a
                  href={`https://${BUSINESS_INFO.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pahad-gold transition-colors"
                >
                  {BUSINESS_INFO.website}
                </a>
              </li>

              <li className="flex items-center gap-3 pt-1">
                <Instagram className="w-4 h-4 text-pahad-gold shrink-0" />
                <a
                  href={BUSINESS_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-pahad-gold hover:text-pahad-green-dark transition-all text-xs font-semibold"
                >
                  <span>{BUSINESS_INFO.instagram}</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Scroll to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF0E1]/70">
          <div>
            <p>
              © {new Date().getFullYear()} {BUSINESS_INFO.name}. All rights reserved. Dehradun, Uttarakhand, India.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[11px] text-[#FFF0E1]/60">
              Thoughtfully Planned. Beautifully Executed.
            </span>

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-full bg-white/10 hover:bg-pahad-gold hover:text-pahad-green-dark transition-all duration-200 text-[#FFF0E1] focus:outline-none"
              aria-label="Scroll back to top"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
