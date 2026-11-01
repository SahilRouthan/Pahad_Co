import React, { useState } from 'react';
import { Star, X, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { api } from '../utils/api';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onReviewSubmitted
}) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [eventType, setEventType] = useState('Destination Wedding');
  const [eventLocation, setEventLocation] = useState('Dehradun / Mussoorie');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      setError('Please provide your name (at least 2 characters).');
      return;
    }
    if (!reviewText.trim() || reviewText.trim().length < 10) {
      setError('Please write at least 10 characters for your review.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.reviews.submit({
        name: name.trim(),
        rating,
        reviewText: reviewText.trim(),
        eventType,
        eventLocation
      });
      setIsSuccess(true);
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setRating(5);
    setReviewText('');
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
          aria-label="Close review dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-pahad-green/10 text-pahad-green flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-pahad-green" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-pahad-green">
              Thank You for Your Review!
            </h3>
            <p className="text-sm text-pahad-charcoal/80 max-w-sm mx-auto">
              Your words mean the world to our mountain event team. Your review has been submitted and will appear on the website upon verification.
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-pahad-gold-dark block mb-1">
                Client Testimonial
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-pahad-green">
                Share Your Experience
              </h3>
              <p className="text-xs text-pahad-charcoal/70 mt-1">
                Help other families and organizations envision their extraordinary moments with PAHAD.co.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Star Rating Picker */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1.5">
                Your Rating <span className="text-red-500">*</span>
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
                      className={`w-7 h-7 ${
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
              <label htmlFor="rev-name" className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1.5">
                Your Name / Family Name <span className="text-red-500">*</span>
              </label>
              <input
                id="rev-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sahil & Priya Sharma"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D9BB87]/50 focus:border-pahad-green text-sm bg-[#FBF6F0]/60 focus:outline-none focus:ring-2 focus:ring-pahad-green"
              />
            </div>

            {/* Event Type & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1.5">
                  Event Type
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D9BB87]/50 focus:border-pahad-green text-xs bg-[#FBF6F0]/60 focus:outline-none"
                >
                  <option value="Destination Wedding">Destination Wedding</option>
                  <option value="Wedding & Reception">Wedding & Reception</option>
                  <option value="Traditional Ceremony">Traditional Ceremony / Haldi</option>
                  <option value="Corporate Retreat">Corporate Retreat</option>
                  <option value="Birthday Celebration">Birthday Celebration</option>
                  <option value="Private Dinner">Private Dinner / Party</option>
                  <option value="Other Event">Other Celebration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1.5">
                  Event Location
                </label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="e.g. Mussoorie / Dehradun"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D9BB87]/50 focus:border-pahad-green text-xs bg-[#FBF6F0]/60 focus:outline-none"
                >
                </input>
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label htmlFor="rev-text" className="block text-xs font-semibold uppercase tracking-wider text-pahad-green mb-1.5">
                Review & Experience <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rev-text"
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience regarding our hospitality, stage styling, coordination, and team support..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#D9BB87]/50 focus:border-pahad-green text-sm bg-[#FBF6F0]/60 focus:outline-none focus:ring-2 focus:ring-pahad-green"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-pahad-green text-[#FFF0E1] font-semibold text-sm hover:bg-pahad-green-hover transition-colors shadow-subtle disabled:opacity-70 focus:outline-none"
              >
                {isSubmitting ? (
                  <span>Submitting Review...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-pahad-gold" />
                    <span>Submit Review</span>
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
