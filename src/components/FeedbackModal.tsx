import React, { useState } from 'react';
import { Star, X, CheckCircle2, AlertCircle, Send, MessageSquareQuote } from 'lucide-react';
import { api } from '../utils/api';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [category, setCategory] = useState('Service Quality');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      setError('Please provide your full name (at least 2 characters).');
      return;
    }
    if (!contact.trim()) {
      setError('Please provide an email or phone number.');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setError('Please provide feedback details (at least 10 characters).');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.feedback.submit({
        name: name.trim(),
        contact: contact.trim(),
        rating,
        category,
        message: message.trim()
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setContact('');
    setRating(5);
    setCategory('Service Quality');
    setMessage('');
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D9BB87]/50 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 p-2 rounded-full bg-pahad-cream hover:bg-[#879B86]/20 text-pahad-charcoal transition-colors focus:outline-none"
          aria-label="Close feedback dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-pahad-green/10 text-pahad-green flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-pahad-green" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-pahad-green">
              Feedback Received
            </h3>
            <p className="text-sm text-pahad-charcoal/80 max-w-sm mx-auto">
              Thank you for helping us elevate the standard of hospitality across Uttarakhand. Our leadership reviews every note carefully.
            </p>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full bg-pahad-green text-[#FFF0E1] text-xs font-semibold hover:bg-pahad-green-hover transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-pahad-green/10 flex items-center justify-center text-pahad-green">
                <MessageSquareQuote className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-pahad-gold-dark">
                  Continuous Improvement
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-pahad-green">
                  Client & Guest Feedback
                </h3>
              </div>
            </div>

            <p className="text-xs text-pahad-charcoal/70">
              Your feedback guides our team in continually perfecting hospitality, catering, stage production, and venue management.
            </p>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Rating Stars */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1">
                Overall Experience Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 text-pahad-gold hover:scale-110 transition-transform focus:outline-none"
                    aria-label={`${star} Stars`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoverRating ?? rating)
                          ? 'fill-pahad-gold text-pahad-gold'
                          : 'text-pahad-charcoal/20'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-pahad-green ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="fb-name" className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="fb-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikram Joshi"
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9BB87]/50 focus:border-pahad-green text-xs sm:text-sm bg-[#FBF6F0]/60 focus:outline-none focus:ring-2 focus:ring-pahad-green"
              />
            </div>

            {/* Contact (email or phone) */}
            <div>
              <label htmlFor="fb-contact" className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1">
                Email or Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="fb-contact"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="e.g. vikram@example.com or +91 98765 43210"
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9BB87]/50 focus:border-pahad-green text-xs sm:text-sm bg-[#FBF6F0]/60 focus:outline-none focus:ring-2 focus:ring-pahad-green"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label htmlFor="fb-category" className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1">
                Feedback Focus Area
              </label>
              <select
                id="fb-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9BB87]/50 focus:border-pahad-green text-xs bg-[#FBF6F0]/60 focus:outline-none"
              >
                <option value="Service Quality">Overall Service Quality</option>
                <option value="Planning & Coordination">Planning & Coordination</option>
                <option value="Catering & Hospitality">Catering & Hospitality</option>
                <option value="Decor & Ambience">Decor, Flowers & Ambience</option>
                <option value="Staff & Management">Staff & On-Ground Management</option>
                <option value="General">General Inquiries / Suggestions</option>
              </select>
            </div>

            {/* Feedback Message */}
            <div>
              <label htmlFor="fb-msg" className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1">
                Your Feedback & Comments <span className="text-red-500">*</span>
              </label>
              <textarea
                id="fb-msg"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what impressed you, or areas where we can make events even more memorable..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#D9BB87]/50 focus:border-pahad-green text-xs sm:text-sm bg-[#FBF6F0]/60 focus:outline-none focus:ring-2 focus:ring-pahad-green"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-pahad-green text-[#FFF0E1] font-semibold text-xs sm:text-sm hover:bg-pahad-green-hover transition-colors shadow-subtle disabled:opacity-70 focus:outline-none"
              >
                {isSubmitting ? (
                  <span>Recording Feedback...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-pahad-gold" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
