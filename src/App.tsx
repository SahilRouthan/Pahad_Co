import { useState, useRef, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EventCategories } from './components/EventCategories';
import { SignatureServices } from './components/SignatureServices';
import { EventGallery } from './components/EventGallery';
import { CustomerReviews } from './components/CustomerReviews';
import { WhyChooseUs } from './components/WhyChooseUs';
import { OurProcess } from './components/OurProcess';
import { ContactCTA } from './components/ContactCTA';
import { InquiryForm } from './components/InquiryForm';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { FeedbackModal } from './components/FeedbackModal';
import { GalleryPage } from './components/GalleryPage';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminUser } from './types';
import { api, getAuthToken, removeAuthToken } from './utils/api';

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'gallery' | 'admin'>('home');
  const [selectedEventType, setSelectedEventType] = useState<string>('Destination Weddings');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const inquiryRef = useRef<HTMLDivElement>(null);

  // Check auth and hash route on mount
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin') {
        setCurrentView('admin');
      } else if (hash === '#gallery-page') {
        setCurrentView('gallery');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);

    const token = getAuthToken();
    if (token) {
      api.admin.getMe()
        .then((res) => {
          if (res && res.user) {
            setAdminUser(res.user);
          }
        })
        .catch(() => {
          removeAuthToken();
          setAdminUser(null);
        })
        .finally(() => {
          setCheckingAuth(false);
        });
    } else {
      setCheckingAuth(false);
    }

    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const scrollToInquiry = (prefillType?: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      window.location.hash = '#contact';
    }

    if (prefillType) {
      setSelectedEventType(prefillType);
    }

    setTimeout(() => {
      if (inquiryRef.current) {
        inquiryRef.current.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          const input = inquiryRef.current?.querySelector('input');
          if (input) input.focus();
        }, 600);
      } else {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const scrollToContact = () => {
    scrollToInquiry();
  };

  // If viewing dedicated full Gallery Page
  if (currentView === 'gallery') {
    return (
      <>
        <GalleryPage
          onBackToHome={() => {
            setCurrentView('home');
            window.location.hash = '#home';
          }}
          onPlanEventClick={() => scrollToInquiry()}
        />
        <WhatsAppButton />
      </>
    );
  }

  // If viewing Admin Portal
  if (currentView === 'admin') {
    if (checkingAuth) {
      return (
        <div className="min-h-screen bg-[#FFF0E1] flex items-center justify-center text-pahad-green text-sm font-semibold">
          Verifying security session...
        </div>
      );
    }

    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={(user) => setAdminUser(user)}
          onBackToSite={() => {
            setCurrentView('home');
            window.location.hash = '#home';
          }}
        />
      );
    }

    return (
      <AdminDashboard
        currentUser={adminUser}
        onLogout={() => {
          setAdminUser(null);
          setCurrentView('home');
          window.location.hash = '#home';
        }}
        onBackToSite={() => {
          setCurrentView('home');
          window.location.hash = '#home';
        }}
      />
    );
  }

  // Default: Main Landing Page
  return (
    <div className="min-h-screen bg-[#FFF0E1] text-[#202522] flex flex-col font-sans selection:bg-pahad-green selection:text-[#FFF0E1]">
      {/* Navigation */}
      <Navbar 
        onPlanEventClick={() => scrollToInquiry()} 
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenAdmin={() => {
          setCurrentView('admin');
          window.location.hash = '#admin';
        }}
        onOpenGalleryPage={() => {
          setCurrentView('gallery');
          window.location.hash = '#gallery-page';
        }}
      />

      <main className="flex-grow">
        {/* Section B: Hero Section */}
        <HeroSection onPlanEventClick={() => scrollToInquiry()} />

        {/* Section C: Event Categories */}
        <EventCategories onSelectCategory={(cat) => scrollToInquiry(cat)} />

        {/* Section D: Signature Services */}
        <SignatureServices onSelectServiceForInquiry={(service) => scrollToInquiry(service)} />

        {/* Section E: Featured Events / Gallery */}
        <EventGallery 
          onOpenFullGallery={() => {
            setCurrentView('gallery');
            window.location.hash = '#gallery-page';
          }} 
        />

        {/* Customer Reviews & Testimonials Section */}
        <CustomerReviews />

        {/* Section F: Why Choose PAHAD.co? */}
        <WhyChooseUs />

        {/* Section G: Our Process */}
        <OurProcess onPlanEventClick={() => scrollToInquiry()} />

        {/* Section H: Call to Action */}
        <ContactCTA 
          onPlanEventClick={() => scrollToInquiry()} 
          onContactClick={scrollToContact} 
        />

        {/* Section I: Contact & Inquiry Form */}
        <InquiryForm 
          ref={inquiryRef} 
          initialEventType={selectedEventType} 
        />
      </main>

      {/* Section J: Footer */}
      <Footer 
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenAdmin={() => {
          setCurrentView('admin');
          window.location.hash = '#admin';
        }}
        onOpenGalleryPage={() => {
          setCurrentView('gallery');
          window.location.hash = '#gallery-page';
        }}
      />

      {/* Floating WhatsApp Quick-Connect Button */}
      <WhatsAppButton />

      {/* Client Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </div>
  );
}

export default App;
