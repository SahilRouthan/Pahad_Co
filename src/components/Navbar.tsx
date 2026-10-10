import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Calendar, ArrowRight } from 'lucide-react';
import { MountainLogo } from './common/MountainLogo';
import { BUSINESS_INFO } from '../data/mockData';

interface NavbarProps {
  onPlanEventClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onPlanEventClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'services', 'events', 'about', 'gallery', 'contact'];
      const scrollPosition = window.scrollY + 180;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Services', href: '#services', id: 'services' },
    { name: 'Events', href: '#events', id: 'events' },
    { name: 'About Us', href: '#about', id: 'about' },
    { name: 'Gallery', href: '#gallery', id: 'gallery' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FFF0E1]/95 backdrop-blur-md shadow-subtle py-3 border-b border-[#D9BB87]/30'
            : 'bg-[#FFF0E1]/80 backdrop-blur-sm py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Logo & Wordmark */}
            <a
              href="#home"
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#064B32] rounded-lg p-1"
              aria-label="PAHAD.co Home"
            >
              <MountainLogo size="md" />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`relative px-3.5 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
                      isActive
                        ? 'text-pahad-green font-semibold'
                        : 'text-pahad-charcoal/80 hover:text-pahad-green hover:bg-[#879B86]/10'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-pahad-green rounded-full" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Right: Phone link & Primary CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-pahad-green hover:text-pahad-green-light transition-colors"
                title="Call our Dehradun desk"
              >
                <span className="w-8 h-8 rounded-full bg-[#879B86]/20 flex items-center justify-center text-pahad-green">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <span>{BUSINESS_INFO.phone}</span>
              </a>

              <button
                onClick={onPlanEventClick}
                className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium tracking-wide text-[#FFF0E1] bg-pahad-green rounded-full overflow-hidden shadow-subtle hover:bg-pahad-green-hover transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pahad-green"
              >
                <span className="relative z-10 flex items-center gap-2 font-medium">
                  <Calendar className="w-4 h-4 text-pahad-gold" />
                  <span>Plan Your Event</span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-pahad-green to-[#0a6b47] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={onPlanEventClick}
                className="text-xs font-semibold px-3 py-1.5 bg-pahad-green text-[#FFF0E1] rounded-full sm:hidden"
              >
                Plan Event
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-pahad-green hover:bg-[#879B86]/20 focus:outline-none focus:ring-2 focus:ring-pahad-green"
                aria-label="Toggle Navigation Menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden border-b border-[#D9BB87]/30 bg-[#FFF0E1] ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100 py-4 shadow-xl' : 'max-h-0 opacity-0 py-0'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 space-y-3">
            <div className="grid grid-cols-2 gap-2 pt-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 text-base font-medium text-pahad-charcoal hover:text-pahad-green hover:bg-[#879B86]/10 rounded-lg transition-colors"
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-4 h-4 text-pahad-gold opacity-60" />
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-[#D9BB87]/30 space-y-3">
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="flex items-center gap-3 text-sm text-pahad-charcoal/90 px-3 py-2 rounded-lg hover:bg-pahad-green/5"
              >
                <div className="w-8 h-8 rounded-full bg-pahad-green/10 flex items-center justify-center text-pahad-green">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-pahad-green tracking-wider">Dehradun Studio</div>
                  <div className="font-medium">{BUSINESS_INFO.phone}</div>
                </div>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onPlanEventClick();
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-[#FFF0E1] bg-pahad-green rounded-full shadow-subtle hover:bg-pahad-green-hover transition-colors"
              >
                <Calendar className="w-4 h-4 text-pahad-gold" />
                <span>Plan Your Event</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
