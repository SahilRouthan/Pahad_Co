-- ==============================================================================
-- PAHAD.co Production Seed Data for Supabase
-- High quality Uttarakhand event gallery items, approved reviews & sample data
-- ==============================================================================

-- 1. Initial Curated Gallery Portfolio
INSERT INTO public.gallery (image_url, title, description, category, display_order)
VALUES
(
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  'Himalayan Sunset Mandap Ceremony',
  'Luxury open-air floral mandap overlooking the sunset valleys of Mussoorie.',
  'Destination Weddings',
  1
),
(
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
  'Royal Valley Wedding Reception',
  'Sophisticated evening fairy-light dining canopy surrounded by pine groves.',
  'Destination Weddings',
  2
),
(
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  'Himalayan Tech & Leadership Summit',
  'Executive plenary conference and audiovisual stage design in Dehradun.',
  'Corporate Events',
  3
),
(
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
  'Boho Meadow Birthday Gala',
  'Enchanting botanical fairy lighting and velvet lounge seating in Kanatal.',
  'Birthday Celebrations',
  4
),
(
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80',
  'Uttarakhand Cultural Sangeet Night',
  'Vibrant traditional pahadi floral lanterns, dhol stage, and folk music ambiance.',
  'Traditional Ceremonies',
  5
),
(
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
  'Starlight Deodar Private Soirée',
  'Exclusive boutique acoustic evening with warm ambient firepits.',
  'Private Parties',
  6
),
(
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
  'Annual College Fest & Youth Conclave',
  'Stage setup, sound engineering, and student coordination for 2,000+ attendees.',
  'School & College Events',
  7
),
(
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
  'Champagne Meadow Celebration',
  'Intimate terrace dinner setting with panoramic views of the Garhwal range.',
  'Destination Weddings',
  8
)
ON CONFLICT DO NOTHING;

-- 2. Initial Approved Customer Testimonials
INSERT INTO public.reviews (customer_name, rating, review_text, event_type, event_location, approval_status, approved_at)
VALUES
(
  'Aarav & Ananya Sharma',
  5,
  'Our destination wedding in Mussoorie felt like a dream. PAHAD.co handled every single detail with immense warmth, precision, and elegance. The floral mandap overlooking the valley was pure poetry.',
  'Destination Wedding',
  'JW Marriott Mussoorie',
  'approved',
  now()
),
(
  'Vikram Malhotra',
  5,
  'Flawless execution for our corporate leadership retreat in Dehradun. From audiovisual setup and high-speed tech needs to catering and hospitality, everything was world-class.',
  'Corporate Leadership Conclave',
  'Dehradun Convention Hub',
  'approved',
  now()
),
(
  'Pooja Rawat & Family',
  5,
  'We hosted my mother’s 60th birthday celebration in Kanatal. The warm pine-scented lighting, live acoustic musicians, and authentic pahadi cuisine made it our family’s best memory.',
  'Milestone Birthday Gala',
  'Kanatal Forest Resort',
  'approved',
  now()
),
(
  'Kunal & Shreya Verma',
  5,
  'The PAHAD.co team treated our wedding like their own family celebration. Every guest was guided smoothly, the security and logistics were effortless, and the decor was breathtaking.',
  'Traditional Pahadi Wedding',
  'Rishikesh Riverfront',
  'approved',
  now()
)
ON CONFLICT DO NOTHING;

-- 3. Initial Sample Inquiries (for Admin demonstration)
INSERT INTO public.inquiries (customer_name, email, phone, event_type, event_date, event_location, budget, message, status)
VALUES
(
  'Rohan Joshi',
  'rohan.joshi@example.com',
  '+91 98765 43210',
  'Destination Weddings',
  '2026-12-15',
  'Mussoorie / Landour',
  '₹15,00,000 - ₹25,00,000',
  'Looking for a 3-day royal destination wedding with mountain view mandap, sangeet production, and accommodation assistance for 180 guests.',
  'new'
),
(
  'Meenakshi Sundaram',
  'meenakshi@innovatetech.in',
  '+91 98111 22334',
  'Corporate Events',
  '2026-11-28',
  'Dehradun',
  '₹8,00,000 - ₹12,00,000',
  'Annual leadership conclave requiring sound, LED walls, stage lighting, guest registration, and high-tea arrangements.',
  'contacted'
)
ON CONFLICT DO NOTHING;

-- 4. Initial Feedback Sample
INSERT INTO public.feedback (customer_name, email, feedback_type, rating, message, status)
VALUES
(
  'Siddharth Singhania',
  'siddharth@example.com',
  'Compliment',
  5,
  'The website design and transparency of services is truly refreshing for Uttarakhand event planning. Keep up the high standard!',
  'new'
)
ON CONFLICT DO NOTHING;
