import express from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import { rateLimitSubmissions, isValidEmail, isValidPhone } from '../middleware/validate.js';

const router = express.Router();

// Public: Submit Client/Guest Feedback
router.post('/', rateLimitSubmissions(60000, 5), (req, res) => {
  try {
    const { name, contact, rating, category, message } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Full name is required (at least 2 characters).' });
    }

    if (!contact || typeof contact !== 'string' || (!isValidEmail(contact) && !isValidPhone(contact))) {
      return res.status(400).json({ success: false, error: 'A valid email or phone number is required.' });
    }

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be an integer between 1 and 5 stars.' });
    }

    const validCategories = [
      'Service Quality',
      'Planning & Coordination',
      'Catering & Hospitality',
      'Decor & Ambience',
      'Staff & Management',
      'General'
    ];

    const feedbackCategory = validCategories.includes(category) ? category : 'General';

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({ success: false, error: 'Feedback message must be at least 10 characters.' });
    }

    const insertStmt = db.prepare(`
      INSERT INTO feedbacks (name, contact, rating, category, message, status)
      VALUES (?, ?, ?, ?, ?, 'new')
    `);

    const result = insertStmt.run(
      name.trim(),
      contact.trim(),
      numRating,
      feedbackCategory,
      message.trim()
    );

    return res.status(201).json({
      success: true,
      id: Number(result.lastInsertRowid),
      message: 'Thank you for your valuable feedback! The PAHAD.co leadership reviews every submission.'
    });
  } catch (error) {
    console.error('[Error: Submit Feedback]', error);
    return res.status(500).json({ success: false, error: 'Failed to record feedback. Please try again.' });
  }
});

// Admin: Get all feedback submissions
router.get('/', authenticateToken, (req, res) => {
  try {
    const { category, rating, status } = req.query;

    let query = 'SELECT * FROM feedbacks';
    const params = [];
    const conditions = [];

    if (category && category !== 'all') {
      conditions.push('category = ?');
      params.push(category);
    }

    if (rating && rating !== 'all') {
      conditions.push('rating = ?');
      params.push(Number(rating));
    }

    if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const feedbackList = stmt.all(...params);

    return res.json({ success: true, count: feedbackList.length, data: feedbackList });
  } catch (error) {
    console.error('[Error: Admin Get Feedback]', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve feedback records.' });
  }
});

// Admin: Update feedback status / notes
router.patch('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const findStmt = db.prepare('SELECT id FROM feedbacks WHERE id = ?');
    const existing = findStmt.get(id);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Feedback record not found.' });
    }

    const updates = [];
    const params = [];

    if (status) {
      const validStatuses = ['new', 'reviewed', 'archived'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status value.' });
      }
      updates.push('status = ?');
      params.push(status);
    }

    if (adminNotes !== undefined) {
      updates.push('admin_notes = ?');
      params.push(adminNotes);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields provided to update.' });
    }

    params.push(id);
    const updateStmt = db.prepare(`UPDATE feedbacks SET ${updates.join(', ')} WHERE id = ?`);
    updateStmt.run(...params);

    return res.json({ success: true, message: 'Feedback record updated.' });
  } catch (error) {
    console.error('[Error: Update Feedback]', error);
    return res.status(500).json({ success: false, error: 'Failed to update feedback.' });
  }
});

// Admin: Delete feedback record
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const deleteStmt = db.prepare('DELETE FROM feedbacks WHERE id = ?');
    const result = deleteStmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Feedback record not found.' });
    }

    return res.json({ success: true, message: 'Feedback record removed.' });
  } catch (error) {
    console.error('[Error: Delete Feedback]', error);
    return res.status(500).json({ success: false, error: 'Failed to delete feedback record.' });
  }
});

export default router;
