import { useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EventCategories } from './components/EventCategories';
import { SignatureServices } from './components/SignatureServices';
import { EventGallery } from './components/EventGallery';
import { WhyChooseUs } from './components/WhyChooseUs';
import { OurProcess } from './components/OurProcess';
import { ContactCTA } from './components/ContactCTA';
import { InquiryForm } from './components/InquiryForm';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';

export function App() {
  const [selectedEventType, setSelectedEventType] = useState<string>('Destination Weddings');
  const inquiryRef = useRef<HTMLDivElement>(null);

  const scrollToInquiry = (prefillType?: string) => {
    if (prefillType) {
      setSelectedEventType(prefillType);
    }
    if (inquiryRef.current) {
      inquiryRef.current.scrollIntoView({ behavior: 'smooth' });
      // Focus on first input if possible
      setTimeout(() => {
        const input = inquiryRef.current?.querySelector('input');
        if (input) input.focus();
      }, 600);
    } else {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    scrollToInquiry();
  };

  return (
    <div className="min-h-screen bg-[#FFF0E1] text-[#202522] flex flex-col font-sans selection:bg-pahad-green selection:text-[#FFF0E1]">
      {/* Navigation */}
      <Navbar onPlanEventClick={() => scrollToInquiry()} />

      <main className="flex-grow">
        {/* Section B: Hero Section */}
        <HeroSection onPlanEventClick={() => scrollToInquiry()} />

        {/* Section C: Event Categories */}
        <EventCategories onSelectCategory={(cat) => scrollToInquiry(cat)} />

        {/* Section D: Signature Services */}
        <SignatureServices onSelectServiceForInquiry={(service) => scrollToInquiry(service)} />

        {/* Section E: Featured Events / Gallery */}
        <EventGallery />

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
      <Footer />

      {/* Floating WhatsApp Quick-Connect Button */}
      <WhatsAppButton />
    </div>
  );
}

export default App;
