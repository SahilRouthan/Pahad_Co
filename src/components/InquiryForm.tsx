import React, { useState, forwardRef, useEffect } from 'react';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  Mail,
  ExternalLink
} from 'lucide-react';
import { InquiryFormData } from '../types';
import { BUSINESS_INFO } from '../data/mockData';
import { BotanicalFlourish } from './common/BotanicalFlourish';

interface InquiryFormProps {
  initialEventType?: string;
}

export const InquiryForm = forwardRef<HTMLDivElement, InquiryFormProps>(
  ({ initialEventType }, ref) => {
    const [formData, setFormData] = useState<InquiryFormData>({
      name: '',
      phone: '',
      email: '',
      eventType: initialEventType || 'Destination Weddings',
      preferredDate: '',
      eventLocation: 'Dehradun, Uttarakhand',
      estimatedBudget: '₹5L - ₹10L',
      message: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof InquiryFormData, string>>>({});
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Update if initialEventType changes externally
    useEffect(() => {
      if (initialEventType) {
        setFormData(prev => ({ ...prev, eventType: initialEventType }));
      }
    }, [initialEventType]);

    const validateForm = (): boolean => {
      const newErrors: Partial<Record<keyof InquiryFormData, string>> = {};

      // Name validation
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      // Phone validation (Indian or international phone format)
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (phoneDigits.length < 10 || phoneDigits.length > 13) {
        newErrors.phone = 'Please enter a valid 10-digit phone number';
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }

      // Event Type validation
      if (!formData.eventType) {
        newErrors.eventType = 'Please select an event category';
      }

      // Date validation
      if (!formData.preferredDate) {
        newErrors.preferredDate = 'Please select a preferred event date';
      }

      // Location validation
      if (!formData.eventLocation.trim()) {
        newErrors.eventLocation = 'Please specify the event location or city';
      }

      // Message validation
      if (!formData.message.trim()) {
        newErrors.message = 'Please provide details or specific requirements for your event';
      } else if (formData.message.trim().length < 10) {
        newErrors.message = 'Please provide a brief description (at least 10 characters)';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name as keyof InquiryFormData]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      // Simulate frontend processing & payload staging
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 500);
    };

    const handleReset = () => {
      setFormData({
        name: '',
        phone: '',
        email: '',
        eventType: 'Destination Weddings',
        preferredDate: '',
        eventLocation: 'Dehradun, Uttarakhand',
        estimatedBudget: '₹5L - ₹10L',
        message: ''
      });
      setErrors({});
      setIsSubmitted(false);
    };

    // Prepare WhatsApp Message URL
    const generateWhatsAppUrl = () => {
      const text = `*New Event Inquiry - PAHAD.co*%0A` +
        `*Name:* ${encodeURIComponent(formData.name)}%0A` +
        `*Phone:* ${encodeURIComponent(formData.phone)}%0A` +
        `*Email:* ${encodeURIComponent(formData.email)}%0A` +
        `*Event Type:* ${encodeURIComponent(formData.eventType)}%0A` +
        `*Preferred Date:* ${encodeURIComponent(formData.preferredDate)}%0A` +
        `*Location:* ${encodeURIComponent(formData.eventLocation)}%0A` +
        `*Budget Range:* ${encodeURIComponent(formData.estimatedBudget)}%0A` +
        `*Requirements:* ${encodeURIComponent(formData.message)}`;
      return `https://wa.me/${BUSINESS_INFO.phoneRaw}?text=${text}`;
    };

    // Prepare Mailto URL
    const generateMailtoUrl = () => {
      const subject = encodeURIComponent(`Event Inquiry: ${formData.eventType} - ${formData.name}`);
      const body = encodeURIComponent(
        `Hello PAHAD.co Team,\n\n` +
        `I would like to inquire about planning an event:\n\n` +
        `Client Name: ${formData.name}\n` +
        `Phone: ${formData.phone}\n` +
        `Email: ${formData.email}\n` +
        `Event Type: ${formData.eventType}\n` +
        `Preferred Date: ${formData.preferredDate}\n` +
        `Event Location: ${formData.eventLocation}\n` +
        `Estimated Budget: ${formData.estimatedBudget}\n\n` +
        `Event Details:\n${formData.message}\n\n` +
        `Looking forward to hearing from you!`
      );
      return `mailto:${BUSINESS_INFO.email}?subject=${subject}&body=${body}`;
    };

    return (
      <section id="contact" ref={ref} className="py-20 md:py-28 bg-[#FFF0E1] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#879B86]/20 border border-[#879B86]/40 text-pahad-green text-xs font-semibold uppercase tracking-wider mb-3">
              <span>Begin Your Journey</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-pahad-green mb-4">
              Let’s Plan Your Next Event
            </h2>
            <BotanicalFlourish variant="divider" />
            <p className="text-base sm:text-lg text-pahad-charcoal/80">
              Share your details below. Our planning team will review your requirements and coordinate with you within 24 hours.
            </p>
          </div>

          {/* Form Surface */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D9BB87]/40 shadow-premium relative">
            
            {isSubmitted ? (
              /* Success / Staged State */
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-full bg-pahad-green/10 text-pahad-green flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8 text-pahad-green" />
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-pahad-green mb-2">
                    Inquiry Prepared Successfully!
                  </h3>
                  <p className="text-sm sm:text-base text-pahad-charcoal/80 max-w-lg mx-auto">
                    Thank you, <strong className="text-pahad-green">{formData.name}</strong>. Your inquiry for <strong className="text-pahad-green">{formData.eventType}</strong> in {formData.eventLocation} on {formData.preferredDate} is structured and ready.
                  </p>
                </div>

                {/* Staged Summary Card */}
                <div className="bg-[#FBF6F0] p-5 rounded-2xl border border-[#D9BB87]/40 text-left max-w-lg mx-auto text-xs sm:text-sm space-y-2">
                  <div className="flex justify-between border-b border-[#D9BB87]/20 pb-1.5">
                    <span className="text-pahad-charcoal/60">Client:</span>
                    <span className="font-semibold text-pahad-green">{formData.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#D9BB87]/20 pb-1.5">
                    <span className="text-pahad-charcoal/60">Phone:</span>
                    <span className="font-semibold text-pahad-green">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#D9BB87]/20 pb-1.5">
                    <span className="text-pahad-charcoal/60">Email:</span>
                    <span className="font-semibold text-pahad-green">{formData.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#D9BB87]/20 pb-1.5">
                    <span className="text-pahad-charcoal/60">Event:</span>
                    <span className="font-semibold text-pahad-green">{formData.eventType}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#D9BB87]/20 pb-1.5">
                    <span className="text-pahad-charcoal/60">Date & Location:</span>
                    <span className="font-semibold text-pahad-green">{formData.preferredDate} • {formData.eventLocation}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-pahad-charcoal/60">Estimated Budget:</span>
                    <span className="font-semibold text-pahad-green">{formData.estimatedBudget}</span>
                  </div>
                </div>

                {/* Immediate Action Buttons (Direct WhatsApp & Mail Dispatch) */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-lg mx-auto">
                  <a
                    href={generateWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-white font-bold text-sm hover:bg-[#20ba59] transition-colors shadow-subtle"
                  >
                    <span>Instant WhatsApp Connect</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <a
                    href={generateMailtoUrl()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-pahad-green text-[#FFF0E1] font-semibold text-sm hover:bg-pahad-green-hover transition-colors shadow-subtle"
                  >
                    <Mail className="w-4 h-4 text-pahad-gold" />
                    <span>Send via Email Client</span>
                  </a>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 text-xs text-pahad-charcoal/70 hover:text-pahad-green transition-colors font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Submit another inquiry / Edit details</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Active Form */
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                
                {/* Row 1: Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Sahil Verma"
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-pahad-green bg-[#FBF6F0]/60 ${
                        errors.name ? 'border-red-400 bg-red-50/40' : 'border-[#D9BB87]/50 focus:border-pahad-green'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-pahad-charcoal/50 text-xs font-medium">
                        +91
                      </span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="87551 05353"
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-pahad-green bg-[#FBF6F0]/60 ${
                          errors.phone ? 'border-red-400 bg-red-50/40' : 'border-[#D9BB87]/50 focus:border-pahad-green'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Email & Event Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. sahil@example.com"
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-pahad-green bg-[#FBF6F0]/60 ${
                        errors.email ? 'border-red-400 bg-red-50/40' : 'border-[#D9BB87]/50 focus:border-pahad-green'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="eventType" className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-2">
                      Event Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[#D9BB87]/50 focus:border-pahad-green text-sm transition-all focus:outline-none focus:ring-2 focus:ring-pahad-green bg-[#FBF6F0]/60"
                    >
                      <option value="Destination Weddings">Destination Wedding (Uttarakhand)</option>
                      <option value="Weddings">Wedding (Bespoke & Traditional)</option>
                      <option value="Traditional Ceremonies">Traditional Ceremony / Haldi / Mehendi</option>
                      <option value="Corporate Events">Corporate Summit / Leadership Retreat</option>
                      <option value="Birthday Celebrations">Birthday & Milestone Celebration</option>
                      <option value="School & College Events">School / College Annual Fest</option>
                      <option value="Private Parties">Private Party / Cocktail Sundowner</option>
                      <option value="Catering & Decoration Only">Catering & Decor Services Only</option>
                      <option value="Other Celebrations">Other Custom Event</option>
                    </select>
                  </div>
                </div>

                {/* Row 3: Date, Location, Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="preferredDate" className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-2">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-pahad-green bg-[#FBF6F0]/60 ${
                        errors.preferredDate ? 'border-red-400 bg-red-50/40' : 'border-[#D9BB87]/50 focus:border-pahad-green'
                      }`}
                    />
                    {errors.preferredDate && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.preferredDate}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="eventLocation" className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-2">
                      Event Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="eventLocation"
                      name="eventLocation"
                      value={formData.eventLocation}
                      onChange={handleChange}
                      placeholder="e.g. Dehradun / Mussoorie / Rishikesh"
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-pahad-green bg-[#FBF6F0]/60 ${
                        errors.eventLocation ? 'border-red-400 bg-red-50/40' : 'border-[#D9BB87]/50 focus:border-pahad-green'
                      }`}
                    />
                    {errors.eventLocation && (
                      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.eventLocation}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="estimatedBudget" className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-2">
                      Estimated Budget
                    </label>
                    <select
                      id="estimatedBudget"
                      name="estimatedBudget"
                      value={formData.estimatedBudget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[#D9BB87]/50 focus:border-pahad-green text-sm transition-all focus:outline-none focus:ring-2 focus:ring-pahad-green bg-[#FBF6F0]/60"
                    >
                      <option value="Under ₹2 Lakhs">Under ₹2 Lakhs</option>
                      <option value="₹2L - ₹5L">₹2L - ₹5L</option>
                      <option value="₹5L - ₹10L">₹5L - ₹10L</option>
                      <option value="₹10L - ₹25L">₹10L - ₹25L</option>
                      <option value="₹25L - ₹50L">₹25L - ₹50L</option>
                      <option value="₹50L+ (Luxury Scale)">₹50L+ (Luxury Scale)</option>
                    </select>
                  </div>
                </div>

                {/* Row 4: Message / Requirements */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-pahad-green">
                      Message / Event Requirements <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-pahad-charcoal/60">
                      {formData.message.length} chars
                    </span>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your expected guest count, vibe, venue preferences, floral styling, or any specific mountain destination dreams..."
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-pahad-green bg-[#FBF6F0]/60 ${
                      errors.message ? 'border-red-400 bg-red-50/40' : 'border-[#D9BB87]/50 focus:border-pahad-green'
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-pahad-green text-[#FFF0E1] font-bold text-base hover:bg-pahad-green-hover transition-all duration-300 shadow-premium disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pahad-green"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-[#FFF0E1] border-t-transparent rounded-full animate-spin" />
                        <span>Validating Details...</span>
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-pahad-gold" />
                        <span>Send Inquiry</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-pahad-charcoal/60 mt-3">
                    Directly handled by PAHAD.co management desk in Dehradun. No spam, ever.
                  </p>
                </div>

              </form>
            )}

          </div>

        </div>
      </section>
    );
  }
);

InquiryForm.displayName = 'InquiryForm';
