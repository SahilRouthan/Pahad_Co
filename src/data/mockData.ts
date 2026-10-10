import { EventCategory, SignatureService, GalleryItem, ProcessStep, WhyChooseItem } from '../types';

export const EVENT_CATEGORIES: EventCategory[] = [
  {
    id: 'destination-weddings',
    title: 'Destination Weddings',
    subtitle: 'Himalayan Romance',
    description: 'Bespoke hillside nuptials with sweeping valley views, luxury alpine resorts, and unforgettable regal hospitality in Mussoorie, Dehradun, and Rishikesh.',
    iconName: 'Compass',
    image: '/hero-wedding.jpg',
    badge: 'Signature Specialty',
    popularFor: 'Mussoorie, Kanatal, Rishikesh & Dehradun Valley'
  },
  {
    id: 'weddings',
    title: 'Weddings',
    subtitle: 'Timeless Celebrations',
    description: 'From grand Baraats to royal Varmala stages and intimate vows, complete wedding execution designed around your heritage and personal love story.',
    iconName: 'HeartHandshake',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    popularFor: 'Pre-wedding, Sangeet & Reception'
  },
  {
    id: 'traditional-ceremonies',
    title: 'Traditional Ceremonies',
    subtitle: 'Cultural & Sacred Rituals',
    description: 'Authentic Pahadi rituals, Haldi, Mehendi, Griha Pravesh, and sacred Vedic ceremonies planned with respect for customs and spiritual grace.',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    popularFor: 'Haldi, Mehendi, Pooja & Garhwali traditions'
  },
  {
    id: 'corporate-events',
    title: 'Corporate Events',
    subtitle: 'Executive Excellence',
    description: 'High-impact annual general meetings, corporate retreats in the hills, leadership summits, gala dinners, and state-of-the-art audiovisual stage setups.',
    iconName: 'Briefcase',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    popularFor: 'Conferences, Hill Retreats & Product Launches'
  },
  {
    id: 'birthday-celebrations',
    title: 'Birthday Celebrations',
    subtitle: 'Joyous Milestones',
    description: 'Themed children birthdays, milestone 25th/50th jubilees, fairy-tale lighting, custom dessert spreads, and interactive entertainment.',
    iconName: 'Cake',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
    popularFor: 'Milestone Birthdays & Kids Themed Bashes'
  },
  {
    id: 'school-college-events',
    title: 'School & College Events',
    subtitle: 'Youth Festivals & Convocations',
    description: 'Annual cultural fests, alumni homecomings, convocation days, sound & laser production, and seamless crowd logistics for educational institutions.',
    iconName: 'GraduationCap',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
    popularFor: 'Convocations, College Fests & Alumni Meets'
  },
  {
    id: 'private-parties',
    title: 'Private Parties',
    subtitle: 'Exclusive Gatherings',
    description: 'Intimate anniversaries, sundowner cocktail soirees overlooking Doon valley, farm celebrations, and bespoke private chef dining experiences.',
    iconName: 'GlassWater',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    popularFor: 'Sundowners, Anniversaries & Cocktail Evenings'
  }
];

export const SIGNATURE_SERVICES: SignatureService[] = [
  {
    id: 'catering-hospitality',
    title: 'Catering & Hospitality',
    shortDescription: 'Professional culinary arrangements, multi-cuisine gourmet dining, and warm Pahadi hospitality that delights every guest.',
    fullDescription: 'From traditional Garhwali feasts to global live culinary stations, our catering team crafts menus tailored to your palate. We oversee banquet coordination, silver-service dining, beverage lounges, and royal guest hospitality from arrival to departure.',
    iconName: 'UtensilsCrossed',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    features: [
      'Authentic Pahadi & Pan-Indian Gourmet Menus',
      'Artisanal Live Cooking Counters & Grazing Tables',
      'Dedicated Guest Care & VIP Protocol',
      'Hygiene Certified Kitchen Logistics'
    ],
    deliverables: ['Custom Menu Tasting', 'Uniformed Waitstaff', 'Glassware & Cutlery Sets', 'Beverage Bar Crafting']
  },
  {
    id: 'event-decoration',
    title: 'Event Decoration & Styling',
    shortDescription: 'Breathtaking stage designs, botanical floral installations, ambient lighting, and thematic venue transformations.',
    fullDescription: 'We craft immersive visual environments combining the natural majesty of Uttarakhand with contemporary aesthetics. Whether it is an ethereal Himalayan floral mandap, vintage candlelight reception, or clean corporate minimalism, our scenographers curate every texture, bloom, and beam.',
    iconName: 'Flower2',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
    features: [
      'Fresh Exotic Floral Mandap & Archways',
      'Warm Fairy-Light Canopies & Architectural Illuminations',
      'Custom Fabric Draping & Thematic Props',
      'Eco-Conscious & Sustainable Decor Options'
    ],
    deliverables: ['3D Moodboards & Floorplans', 'Full Setup & Teardown', 'Entrance Statement Arches', 'Centerpieces & Photo Booths']
  },
  {
    id: 'volunteer-staff-management',
    title: 'Volunteer & Staff Management',
    shortDescription: 'Reliable on-ground coordination, seasoned supervisors, and trained event support personnel dedicated to flawless timing.',
    fullDescription: 'Behind every effortless event is a synchronized team. We deploy groomed, proactive event hosts, shadow coordinators for the bride & groom, backstage stage managers, and ushering staff trained in hospitality etiquette.',
    iconName: 'Users',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
    features: [
      'Dedicated Bridal & Groom Shadow Coordinators',
      'Backstage Production & Run-of-Show Timers',
      'Crowd Flow & Seating Ushers',
      'Multi-lingual Guest Assistance'
    ],
    deliverables: ['Real-time Walkie-talkie Comms', 'Timeline Master Schedule', 'Vendor Liaison Desk', 'Emergency Response Kit']
  },
  {
    id: 'security-guest-management',
    title: 'Security & Guest Management',
    shortDescription: 'Discreet, professional event security, organized valet parking, RSVP tracking, and smooth VIP logistics.',
    fullDescription: 'Your peace of mind is paramount. We provide licensed security guards, access-controlled guest entry, valet parking management for hillside roads, and digitized RSVP check-ins to ensure your celebrations remain intimate, safe, and organized.',
    iconName: 'ShieldCheck',
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80',
    features: [
      'RSVP Confirmation & Digital QR Entry',
      'Valet & Hill-Road Traffic Regulation',
      'Discreet Executive Protection for Dignitaries',
      'Baggage & Cloakroom Management'
    ],
    deliverables: ['Traffic Marshals', 'Bouncer & Guard Staffing', 'Emergency Medical Liaison', 'Venue Perimeter Surveillance']
  },
  {
    id: 'photography-videography',
    title: 'Photography & Videography',
    shortDescription: 'Capture raw emotions, cinematic mountain vistas, and candid laughter with professional visual storytellers.',
    fullDescription: 'Our visual storytellers specialize in high-end wedding cinema, editorial portraits, drone aerial sweeps of mountain valley venues, and instant teaser reels that capture the spirit of your celebration forever.',
    iconName: 'Camera',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
    features: [
      'Cinematic 4K Wedding Films & Teasers',
      'Drone Aerial Videography over Valley Vistas',
      'Candid & Editorial Portrait Photographers',
      'Same-Day Social Media Highlights'
    ],
    deliverables: ['High-Res Cloud Gallery', 'Handcrafted Coffee Table Album', 'Full Raw Footage Archive', 'Teaser Reel for Instagram']
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Sunset Mandap in Mussoorie Hills',
    category: 'Weddings',
    location: 'Mussoorie Ridge, Uttarakhand',
    image: '/hero-wedding.jpg',
    aspect: 'landscape',
    caption: 'An open-air mountain mandap bathed in golden hour light with marigold & white rose garlands overlooking the Himalayas.'
  },
  {
    id: 'gal-2',
    title: 'Garhwali Haldi Radiance',
    category: 'Ceremonies',
    location: 'Dehradun Valley Estate',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
    aspect: 'portrait',
    caption: 'Traditional yellow marigold and brass urli backdrop with sacred folk blessings.'
  },
  {
    id: 'gal-3',
    title: 'Himalayan Leadership Summit',
    category: 'Corporate',
    location: 'Rishikesh Riverfront Resort',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    aspect: 'landscape',
    caption: 'Curated corporate amphitheater stage with acoustic styling and ambient pine green backlighting.'
  },
  {
    id: 'gal-4',
    title: 'Whimsical 30th Birthday Garden Soiree',
    category: 'Birthdays',
    location: 'Rajpur Road Greens, Dehradun',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80',
    aspect: 'square',
    caption: 'Warm festoon fairy lights, artisanal dessert cart, and botanical floral installations.'
  },
  {
    id: 'gal-5',
    title: 'Candlelight Forest Dining',
    category: 'Dinners',
    location: 'Kanatal Cedar Woods',
    image: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
    aspect: 'landscape',
    caption: 'A 40-seat banquet table beneath cedar canopies with taper candles and hand-stamped menus.'
  },
  {
    id: 'gal-6',
    title: 'Royal Himalayan Varmala Stage',
    category: 'Weddings',
    location: 'Heritage Resort, Dehradun',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80',
    aspect: 'portrait',
    caption: 'Grand multi-tiered floral platform designed with cascading orchids and brass lamps.'
  },
  {
    id: 'gal-7',
    title: 'Bespoke Sangeet Night Under the Stars',
    category: 'Ceremonies',
    location: 'Doon Valley Foothills',
    image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
    aspect: 'landscape',
    caption: 'Dynamic truss lighting, handcrafted wooden dance floor, and live folk fusion ensemble.'
  },
  {
    id: 'gal-8',
    title: 'Alpine Corporate Gala Dinner',
    category: 'Corporate',
    location: 'Mussoorie Luxury Pavilion',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80',
    aspect: 'square',
    caption: 'Sleek executive awards night setup with warm gold accents and crystal chandeliers.'
  }
];

export const WHY_CHOOSE_ITEMS: WhyChooseItem[] = [
  {
    id: 'creative-planning',
    title: 'Creative Planning',
    highlight: 'Tailored to Your Soul',
    description: 'Unique concepts tailored to your personal aesthetic, culture, and vision. We do not recycle cookie-cutter templates.',
    iconName: 'Palette'
  },
  {
    id: 'experienced-team',
    title: 'Experienced Team',
    highlight: 'Skilled Hill Specialists',
    description: 'Seasoned professionals with deep knowledge of Uttarakhand terrain, weather dynamics, and hospitality nuances.',
    iconName: 'Award'
  },
  {
    id: 'attention-to-detail',
    title: 'Attention to Detail',
    highlight: 'Meticulously Curated',
    description: 'From the fold of a napkin to minute-by-minute vendor queues, every single element is planned with exacting precision.',
    iconName: 'CheckCircle2'
  },
  {
    id: 'trusted-network',
    title: 'Trusted Network',
    highlight: 'Vetted Regional Partners',
    description: 'Established relationships with premier mountain resorts, artisanal florists, caterers, and technical sound engineers.',
    iconName: 'Handshake'
  },
  {
    id: 'memories-that-last',
    title: 'Memories That Last',
    highlight: 'Everlasting Moments',
    description: 'We don’t just plan events, we curate genuine moments of awe, warmth, and nostalgia that you and your guests cherish forever.',
    iconName: 'Sparkles'
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    step: 'Step 01',
    title: 'Tell Us Your Vision',
    description: 'Share your event dream, preferred aesthetics, guest numbers, dates, and must-have elements with our planning directors.',
    details: 'Initial consultation over coffee or video call to understand your story, culture, and aspirations.',
    iconName: 'MessageSquareText'
  },
  {
    number: '02',
    step: 'Step 02',
    title: 'Plan Together',
    description: 'We explore hand-picked venues across Dehradun & Uttarakhand, design 3D theme boards, lock transparent budgets, and finalize menus.',
    details: 'Transparent proposals, bespoke decor concepts, vendor shortlisting, and detailed timelines.',
    iconName: 'Compass'
  },
  {
    number: '03',
    step: 'Step 03',
    title: 'We Bring It to Life',
    description: 'Our production crews, florists, and hospitality teams arrive on site to coordinate every single moving piece seamlessly.',
    details: 'Rigorous rehearsals, sound checks, vendor management, guest reception, and bridal assistance.',
    iconName: 'Hammer'
  },
  {
    number: '04',
    step: 'Step 04',
    title: 'Celebrate the Moment',
    description: 'Immerse yourself completely in the joy of the occasion. Dance, laugh, and celebrate while PAHAD.co handles every detail.',
    details: 'Zero stress for you and your family—just pure, extraordinary memories that will be spoken of for decades.',
    iconName: 'PartyPopper'
  }
];

export const BUSINESS_INFO = {
  name: 'PAHAD.co',
  tagline: 'You Dream It, We Make It Extraordinary.',
  message: 'We don’t just plan events, we create moments that last forever.',
  location: 'Dehradun, Uttarakhand, India',
  phone: '+91 87551 05353',
  phoneRaw: '918755105353',
  email: 'pahad.co@gmail.com',
  website: 'pahad.co',
  instagram: '@pahad.co',
  instagramUrl: 'https://instagram.com/pahad.co',
  whatsappMessage: 'Hello PAHAD.co team! I would like to inquire about planning an event in Uttarakhand.'
};
