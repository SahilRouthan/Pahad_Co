import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Calendar, ArrowRight, MessageSquareQuote, Shield } from 'lucide-react';
import { MountainLogo } from './common/MountainLogo';
import { ThemeToggle } from './common/ThemeToggle';
import { BUSINESS_INFO } from '../data/mockData';

interface NavbarProps {
  onPlanEventClick: () => void;
  onOpenFeedback?: () => void;
  onOpenAdmin?: () => void;
  onOpenGalleryPage?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onPlanEventClick,
  onOpenFeedback,
  onOpenAdmin,
  onOpenGalleryPage
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'services', 'events', 'about', 'reviews', 'gallery', 'contact'];
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
    { name: 'Reviews', href: '#reviews', id: 'reviews' },
    { name: 'Gallery', href: '#gallery', id: 'gallery' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FFF0E1]/95 dark:bg-[#062F26]/95 backdrop-blur-md shadow-subtle py-3 border-b border-[#D9BB87]/30 dark:border-[#D9B477]/25'
            : 'bg-[#FFF0E1]/85 dark:bg-[#062F26]/85 backdrop-blur-sm py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Logo & Wordmark */}
            <a
              href="#home"
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-pahad-green dark:focus:ring-pahad-gold rounded-lg p-1"
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
                        ? 'text-pahad-green dark:text-[#FFF3E5] font-semibold'
                        : 'text-pahad-charcoal/80 dark:text-[#FFF3E5]/75 hover:text-pahad-green dark:hover:text-[#D9B477] hover:bg-[#879B86]/10 dark:hover:bg-[#0B4636]/60'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-pahad-green dark:bg-[#D9B477] rounded-full" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Right: Theme Toggle, Phone link, Feedback & Primary CTA Button */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* Theme Toggle Button */}
              <ThemeToggle />

              {onOpenFeedback && (
                <button
                  onClick={onOpenFeedback}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-[#0B4636] hover:bg-white dark:hover:bg-[#0E5240] text-pahad-green dark:text-[#FFF3E5] border border-[#D9BB87]/40 dark:border-[#D9B477]/30 text-xs font-semibold transition-colors"
                  title="Share your feedback with us"
                >
                  <MessageSquareQuote className="w-3.5 h-3.5 text-pahad-gold-dark dark:text-[#D9B477]" />
                  <span>Feedback</span>
                </button>
              )}

              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-pahad-green dark:text-[#FFF3E5] hover:text-pahad-green-light dark:hover:text-[#D9B477] transition-colors"
                title="Call our Dehradun desk"
              >
                <span className="w-8 h-8 rounded-full bg-[#879B86]/20 dark:bg-[#0B4636] flex items-center justify-center text-pahad-green dark:text-[#D9B477]">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <span>{BUSINESS_INFO.phone}</span>
              </a>

              <button
                onClick={onPlanEventClick}
                className="relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium tracking-wide text-[#FFF0E1] bg-pahad-green rounded-full overflow-hidden shadow-subtle hover:bg-pahad-green-hover transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pahad-green dark:focus:ring-offset-[#062F26]"
              >
                <span className="relative z-10 flex items-center gap-2 font-medium">
                  <Calendar className="w-4 h-4 text-pahad-gold" />
                  <span>Plan Your Event</span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-pahad-green to-[#0a6b47] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="p-2 rounded-full hover:bg-pahad-green/10 dark:hover:bg-[#0B4636] text-pahad-green/60 dark:text-[#FFF3E5]/60 hover:text-pahad-green dark:hover:text-[#D9B477] transition-colors"
                  title="Admin Console"
                  aria-label="Admin Console"
                >
                  <Shield className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Actions: Theme Toggle + Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <ThemeToggle />

              {onOpenFeedback && (
                <button
                  onClick={onOpenFeedback}
                  className="text-xs font-medium px-2.5 py-1 bg-white dark:bg-[#0B4636] border border-[#D9BB87]/40 dark:border-[#D9B477]/30 text-pahad-green dark:text-[#FFF3E5] rounded-full"
                >
                  Feedback
                </button>
              )}
              <button
                onClick={onPlanEventClick}
                className="text-xs font-semibold px-3 py-1.5 bg-pahad-green text-[#FFF0E1] rounded-full sm:hidden"
              >
                Plan Event
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-pahad-green dark:text-[#FFF3E5] hover:bg-[#879B86]/20 dark:hover:bg-[#0B4636] focus:outline-none focus:ring-2 focus:ring-pahad-green"
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
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden border-b border-[#D9BB87]/30 dark:border-[#D9B477]/25 bg-[#FFF0E1] dark:bg-[#062F26] ${
            mobileMenuOpen ? 'max-h-[550px] opacity-100 py-4 shadow-xl' : 'max-h-0 opacity-0 py-0'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 space-y-3">
            <div className="grid grid-cols-2 gap-2 pt-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 text-base font-medium text-pahad-charcoal dark:text-[#FFF3E5] hover:text-pahad-green dark:hover:text-[#D9B477] hover:bg-[#879B86]/10 dark:hover:bg-[#0B4636]/60 rounded-lg transition-colors"
                >
                  <span>{link.name}</span>
                  <ArrowRight className="w-4 h-4 text-pahad-gold opacity-60" />
                </a>
              ))}
              {onOpenGalleryPage && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenGalleryPage();
                  }}
                  className="flex items-center justify-between px-3 py-2.5 text-base font-medium text-pahad-green dark:text-[#D9B477] hover:bg-[#879B86]/10 dark:hover:bg-[#0B4636]/60 rounded-lg transition-colors col-span-2 text-left"
                >
                  <span>Full Photo Archives</span>
                  <ArrowRight className="w-4 h-4 text-pahad-gold" />
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-[#D9BB87]/30 dark:border-[#D9B477]/25 space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-semibold text-pahad-charcoal/70 dark:text-[#E8DFD3]/70">Theme Mode</span>
                <ThemeToggle variant="pill" showLabel={true} />
              </div>

              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="flex items-center gap-3 text-sm text-pahad-charcoal/90 dark:text-[#FFF3E5]/90 px-3 py-2 rounded-lg hover:bg-pahad-green/5 dark:hover:bg-[#0B4636]/40"
              >
                <div className="w-8 h-8 rounded-full bg-pahad-green/10 dark:bg-[#0B4636] flex items-center justify-center text-pahad-green dark:text-[#D9B477]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-semibold text-pahad-green dark:text-[#D9B477] tracking-wider">Dehradun Studio</div>
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
