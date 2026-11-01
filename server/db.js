import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = process.env.DB_PATH || './server/data/pahad.sqlite';
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(dbPath);

// Enable WAL-like features and foreign keys
db.exec('PRAGMA foreign_keys = ON;');

// Initialize database schema
export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS client_queries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      event_type TEXT NOT NULL,
      preferred_date TEXT NOT NULL,
      event_location TEXT NOT NULL,
      estimated_budget TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new', -- 'new', 'contacted', 'in_progress', 'completed', 'archived'
      admin_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS customer_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      review_text TEXT NOT NULL,
      event_type TEXT,
      event_location TEXT,
      status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
      approved_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS feedbacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      category TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'new', -- 'new', 'reviewed', 'archived'
      admin_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS gallery_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      image_url TEXT NOT NULL,
      aspect TEXT DEFAULT 'landscape', -- 'landscape', 'portrait', 'square'
      caption TEXT,
      is_featured INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_queries_status ON client_queries(status);
    CREATE INDEX IF NOT EXISTS idx_reviews_status ON customer_reviews(status);
    CREATE INDEX IF NOT EXISTS idx_feedbacks_status ON feedbacks(status);
    CREATE INDEX IF NOT EXISTS idx_gallery_cat ON gallery_images(category);
  `);

  seedInitialData();
}

function seedInitialData() {
  // 1. Seed Admin
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'PahadAdmin@2026';

  const checkAdminStmt = db.prepare('SELECT id FROM admins WHERE username = ?');
  const existingAdmin = checkAdminStmt.get(adminUsername);

  if (!existingAdmin) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(adminPassword, salt);
    const insertAdmin = db.prepare('INSERT INTO admins (username, password_hash, role) VALUES (?, ?, ?)');
    insertAdmin.run(adminUsername, hash, 'superadmin');
    console.log(`[DB] Created default admin account: ${adminUsername}`);
  }

  // 2. Seed Initial Gallery Images if empty
  const countGalleryStmt = db.prepare('SELECT COUNT(*) as count FROM gallery_images');
  const galleryCount = countGalleryStmt.get().count;

  if (galleryCount === 0) {
    const initialImages = [
      {
        title: 'Sunset Mandap in Mussoorie Hills',
        category: 'Weddings',
        location: 'Mussoorie Ridge, Uttarakhand',
        image_url: '/hero-wedding.jpg',
        aspect: 'landscape',
        caption: 'An open-air mountain mandap bathed in golden hour light with marigold & white rose garlands overlooking the Himalayas.',
        is_featured: 1,
        display_order: 1
      },
      {
        title: 'Garhwali Haldi Radiance',
        category: 'Ceremonies',
        location: 'Dehradun Valley Estate',
        image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
        aspect: 'portrait',
        caption: 'Traditional yellow marigold and brass urli backdrop with sacred folk blessings.',
        is_featured: 1,
        display_order: 2
      },
      {
        title: 'Himalayan Leadership Summit',
        category: 'Corporate',
        location: 'Rishikesh Riverfront Resort',
        image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        aspect: 'landscape',
        caption: 'Curated corporate amphitheater stage with acoustic styling and ambient pine green backlighting.',
        is_featured: 0,
        display_order: 3
      },
      {
        title: 'Whimsical 30th Birthday Garden Soiree',
        category: 'Birthdays',
        location: 'Rajpur Road Greens, Dehradun',
        image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80',
        aspect: 'square',
        caption: 'Warm festoon fairy lights, artisanal dessert cart, and botanical floral installations.',
        is_featured: 0,
        display_order: 4
      },
      {
        title: 'Candlelight Forest Dining',
        category: 'Dinners',
        location: 'Kanatal Cedar Woods',
        image_url: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
        aspect: 'landscape',
        caption: 'A 40-seat banquet table beneath cedar canopies with taper candles and hand-stamped menus.',
        is_featured: 1,
        display_order: 5
      },
      {
        title: 'Royal Himalayan Varmala Stage',
        category: 'Weddings',
        location: 'Heritage Resort, Dehradun',
        image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=900&q=80',
        aspect: 'portrait',
        caption: 'Grand multi-tiered floral platform designed with cascading orchids and brass lamps.',
        is_featured: 1,
        display_order: 6
      },
      {
        title: 'Bespoke Sangeet Night Under the Stars',
        category: 'Ceremonies',
        location: 'Doon Valley Foothills',
        image_url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
        aspect: 'landscape',
        caption: 'Dynamic truss lighting, handcrafted wooden dance floor, and live folk fusion ensemble.',
        is_featured: 0,
        display_order: 7
      },
      {
        title: 'Alpine Corporate Gala Dinner',
        category: 'Corporate',
        location: 'Mussoorie Luxury Pavilion',
        image_url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=900&q=80',
        aspect: 'square',
        caption: 'Sleek executive awards night setup with warm gold accents and crystal chandeliers.',
        is_featured: 0,
        display_order: 8
      }
    ];

    const insertGalleryStmt = db.prepare(`
      INSERT INTO gallery_images (title, category, location, image_url, aspect, caption, is_featured, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const img of initialImages) {
      insertGalleryStmt.run(img.title, img.category, img.location, img.image_url, img.aspect, img.caption, img.is_featured, img.display_order);
    }
    console.log(`[DB] Seeded ${initialImages.length} initial gallery images.`);
  }

  // 3. Seed Initial Approved Customer Reviews if empty
  const countReviewsStmt = db.prepare('SELECT COUNT(*) as count FROM customer_reviews');
  const reviewCount = countReviewsStmt.get().count;

  if (reviewCount === 0) {
    const initialReviews = [
      {
        name: 'Aarav & Priyanshi Sharma',
        rating: 5,
        review_text: 'Our 3-day destination wedding in Mussoorie was beyond what we ever dreamed of! The PAHAD.co team orchestrated the hillside logistics, weather contingencies, and the sunset mandap with absolute calm. Every guest was mesmerized.',
        event_type: 'Destination Wedding',
        event_location: 'Mussoorie',
        status: 'approved'
      },
      {
        name: 'Vikramaditya Rawat',
        rating: 5,
        review_text: 'Being Garhwali, preserving our authentic rituals was non-negotiable for my daughter’s wedding. PAHAD.co blended authentic mountain traditions with sheer luxury. The traditional Pahadi culinary feast was the talk of Dehradun!',
        event_type: 'Traditional Ceremony',
        event_location: 'Dehradun Valley',
        status: 'approved'
      },
      {
        name: 'Neha Kapoor (VP Operations, Apex Tech)',
        rating: 5,
        review_text: 'We hosted our annual leadership retreat in Rishikesh with 120 executives. From sound production to riverside dining setups and transport marshals, everything ran like clockwork. Extremely professional.',
        event_type: 'Corporate Retreat',
        event_location: 'Rishikesh',
        status: 'approved'
      },
      {
        name: 'Devraj & Shreya Joshi',
        rating: 5,
        review_text: 'Attention to detail is their superpower! Every floral arrangement, lighting cue, and bridal escort was handled with genuine warmth. We truly enjoyed our own event without a shred of stress.',
        event_type: 'Wedding & Reception',
        event_location: 'Kanatal',
        status: 'approved'
      }
    ];

    const insertReviewStmt = db.prepare(`
      INSERT INTO customer_reviews (name, rating, review_text, event_type, event_location, status, approved_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    for (const rev of initialReviews) {
      insertReviewStmt.run(rev.name, rev.rating, rev.review_text, rev.event_type, rev.event_location, rev.status);
    }
    console.log(`[DB] Seeded ${initialReviews.length} initial customer reviews.`);
  }

  // 4. Seed Initial Feedback if empty
  const countFeedbackStmt = db.prepare('SELECT COUNT(*) as count FROM feedbacks');
  const feedbackCount = countFeedbackStmt.get().count;

  if (feedbackCount === 0) {
    const insertFeedbackStmt = db.prepare(`
      INSERT INTO feedbacks (name, contact, rating, category, message, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertFeedbackStmt.run(
      'Sunil Negi',
      'sunil.negi@outlook.com',
      5,
      'Catering & Hospitality',
      'The traditional Garhwali dishes served at the reception were authentic and prepared with great finesse. Highly appreciated by all our elderly relatives.',
      'reviewed'
    );
    insertFeedbackStmt.run(
      'Kavita Mathur',
      '+91 98971 22334',
      5,
      'Decor & Ambience',
      'The candlelight pine forest dining concept at Kanatal was ethereal. The fairy lighting and table styling exceeded expectations.',
      'new'
    );
    console.log('[DB] Seeded initial feedbacks.');
  }

  // 5. Seed Initial Client Query if empty
  const countQueryStmt = db.prepare('SELECT COUNT(*) as count FROM client_queries');
  const queryCount = countQueryStmt.get().count;

  if (queryCount === 0) {
    const insertQueryStmt = db.prepare(`
      INSERT INTO client_queries (name, phone, email, event_type, preferred_date, event_location, estimated_budget, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertQueryStmt.run(
      'Rohan Malhotra',
      '98110 54321',
      'rohan.malhotra@gmail.com',
      'Destination Weddings',
      '2026-11-20',
      'Mussoorie Ridge',
      '₹25L - ₹50L',
      'Planning a 3-day hillside wedding for approx 200 guests. Interested in open-air mandap and sangeet stage with full hospitality support.',
      'new'
    );
    console.log('[DB] Seeded initial client query.');
  }
}
