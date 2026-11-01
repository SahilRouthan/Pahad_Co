import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, Quote, MapPin, Sparkles } from 'lucide-react';
import { CustomerReview } from '../types';
import { api } from '../utils/api';
import { BotanicalFlourish } from './common/BotanicalFlourish';
import { ReviewModal } from './ReviewModal';

export const CustomerReviews: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.reviews.getApproved();
      if (res && res.data) {
        setReviews(res.data);
      }
    } catch (err) {
      console.warn('Could not load reviews from API, using fallback data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <section id="reviews" className="py-20 md:py-28 bg-[#FBF6F0] relative border-t border-[#D9BB87]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#879B86]/20 border border-[#879B86]/40 text-pahad-green text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-pahad-gold-dark" />
            <span>Honest Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-pahad-green mb-4">
            Cherished Words from Our Clients
          </h2>
          <BotanicalFlourish variant="divider" />
          <p className="text-base sm:text-lg text-pahad-charcoal/80">
            Real experiences from weddings, summits, and milestones crafted across the valleys and heights of Uttarakhand.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#D9BB87]/40 shadow-xs">
              <div className="flex text-pahad-gold">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-pahad-green">
                5.0 Client Rating
              </span>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-pahad-green text-[#FFF0E1] text-xs font-semibold hover:bg-pahad-green-hover transition-colors shadow-subtle"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-pahad-gold" />
              <span>Share Your Experience</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        {loading && reviews.length === 0 ? (
          <div className="text-center py-12 text-sm text-pahad-charcoal/60">
            Loading reviews from Uttarakhand...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-7 sm:p-8 border border-[#D9BB87]/40 shadow-subtle hover:shadow-premium transition-all duration-300 flex flex-col justify-between relative group"
              >
                <div>
                  {/* Top Quote Icon & Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-full bg-pahad-cream flex items-center justify-center text-pahad-green">
                      <Quote className="w-5 h-5 text-pahad-gold-dark fill-pahad-gold/20" />
                    </div>
                    <div className="flex text-pahad-gold">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-sm sm:text-base text-pahad-charcoal/85 italic leading-relaxed mb-6 font-normal">
                    “{rev.review_text}”
                  </p>
                </div>

                {/* Reviewer Details */}
                <div className="pt-4 border-t border-[#D9BB87]/25 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-base text-pahad-green">
                      {rev.name}
                    </h3>
                    <span className="text-xs text-pahad-charcoal/60">
                      {rev.event_type || 'Event Celebration'}
                    </span>
                  </div>

                  {rev.event_location && (
                    <div className="flex items-center gap-1 text-xs text-pahad-sage-dark font-medium bg-[#879B86]/10 px-3 py-1 rounded-full">
                      <MapPin className="w-3 h-3 text-pahad-green shrink-0" />
                      <span>{rev.event_location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onReviewSubmitted={fetchReviews}
      />
    </section>
  );
};
