import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.resolve('public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'pahad-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|svg/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG, PNG, WEBP, and SVG image files are supported.'));
  }
});

// Public: Get gallery images (with optional category filter)
router.get('/', (req, res) => {
  try {
    const { category } = req.query;

    let query = 'SELECT * FROM gallery_images';
    const params = [];

    if (category && category !== 'All') {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY display_order ASC, created_at DESC';

    const stmt = db.prepare(query);
    const images = stmt.all(...params);

    return res.json({ success: true, count: images.length, data: images });
  } catch (error) {
    console.error('[Error: Get Gallery Images]', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve gallery images.' });
  }
});

// Admin: Add a new gallery image (supports both multipart file upload and JSON with image_url)
router.post('/', authenticateToken, upload.single('imageFile'), (req, res) => {
  try {
    const { title, category, location, aspect, caption, isFeatured, displayOrder } = req.body;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Title is required.' });
    }

    if (!category || typeof category !== 'string') {
      return res.status(400).json({ success: false, error: 'Category is required.' });
    }

    if (!location || typeof location !== 'string') {
      return res.status(400).json({ success: false, error: 'Location is required.' });
    }

    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Image URL or file upload is required.' });
    }

    const insertStmt = db.prepare(`
      INSERT INTO gallery_images (
        title, category, location, image_url, aspect, caption, is_featured, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      title.trim(),
      category.trim(),
      location.trim(),
      imageUrl.trim(),
      aspect || 'landscape',
      caption ? caption.trim() : '',
      isFeatured === 'true' || isFeatured === 1 ? 1 : 0,
      Number(displayOrder) || 0
    );

    return res.status(201).json({
      success: true,
      id: Number(result.lastInsertRowid),
      imageUrl,
      message: 'Gallery image added successfully.'
    });
  } catch (error) {
    console.error('[Error: Add Gallery Image]', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to add gallery image.' });
  }
});

// Admin: Update gallery image metadata
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, location, imageUrl, aspect, caption, isFeatured, displayOrder } = req.body;

    const findStmt = db.prepare('SELECT id FROM gallery_images WHERE id = ?');
    const existing = findStmt.get(id);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Gallery image not found.' });
    }

    const updateStmt = db.prepare(`
      UPDATE gallery_images SET
        title = COALESCE(?, title),
        category = COALESCE(?, category),
        location = COALESCE(?, location),
        image_url = COALESCE(?, image_url),
        aspect = COALESCE(?, aspect),
        caption = COALESCE(?, caption),
        is_featured = COALESCE(?, is_featured),
        display_order = COALESCE(?, display_order)
      WHERE id = ?
    `);

    updateStmt.run(
      title ? title.trim() : null,
      category ? category.trim() : null,
      location ? location.trim() : null,
      imageUrl ? imageUrl.trim() : null,
      aspect || null,
      caption !== undefined ? caption.trim() : null,
      isFeatured !== undefined ? (isFeatured ? 1 : 0) : null,
      displayOrder !== undefined ? Number(displayOrder) : null,
      id
    );

    return res.json({ success: true, message: 'Gallery image updated successfully.' });
  } catch (error) {
    console.error('[Error: Update Gallery Image]', error);
    return res.status(500).json({ success: false, error: 'Failed to update gallery image.' });
  }
});

// Admin: Delete gallery image
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const deleteStmt = db.prepare('DELETE FROM gallery_images WHERE id = ?');
    const result = deleteStmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Gallery image not found.' });
    }

    return res.json({ success: true, message: 'Gallery image deleted successfully.' });
  } catch (error) {
    console.error('[Error: Delete Gallery Image]', error);
    return res.status(500).json({ success: false, error: 'Failed to delete gallery image.' });
  }
});

export default router;
