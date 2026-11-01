import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { initDB } from './db.js';

import queriesRouter from './routes/queries.js';
import reviewsRouter from './routes/reviews.js';
import feedbackRouter from './routes/feedback.js';
import galleryRouter from './routes/gallery.js';
import adminRouter from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database & Tables
initDB();

// CORS Configuration
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman) or localhost
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    callback(null, true);
  },
  credentials: true
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploaded images
app.use('/uploads', express.static(path.resolve('public', 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'PAHAD.co API Server',
    database: 'SQLite (node:sqlite)',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/queries', queriesRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/admin', adminRouter);

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`[PAHAD.co Server] Running on http://localhost:${PORT}`);
  console.log(`[PAHAD.co Server] Health check available at http://localhost:${PORT}/api/health`);
});
