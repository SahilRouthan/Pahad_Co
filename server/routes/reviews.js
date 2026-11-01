import express from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import { rateLimitSubmissions } from '../middleware/validate.js';

const router = express.Router();

// Public: Get Approved Reviews
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT id, name, rating, review_text, event_type, event_location, created_at 
      FROM customer_reviews 
      WHERE status = 'approved' 
      ORDER BY id DESC
    `);
    const reviews = stmt.all();

    return res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    console.error('[Error: Get Approved Reviews]', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve reviews.' });
  }
});

// Public: Submit a New Review
router.post('/', rateLimitSubmissions(60000, 3), (req, res) => {
  try {
    const { name, rating, reviewText, eventType, eventLocation } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Name is required (at least 2 characters).' });
    }

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be an integer between 1 and 5 stars.' });
    }

    if (!reviewText || typeof reviewText !== 'string' || reviewText.trim().length < 10) {
      return res.status(400).json({ success: false, error: 'Review text must be at least 10 characters.' });
    }

    const insertStmt = db.prepare(`
      INSERT INTO customer_reviews (name, rating, review_text, event_type, event_location, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `);

    const result = insertStmt.run(
      name.trim(),
      numRating,
      reviewText.trim(),
      eventType ? eventType.trim() : 'Event Celebration',
      eventLocation ? eventLocation.trim() : 'Uttarakhand'
    );

    return res.status(201).json({
      success: true,
      id: Number(result.lastInsertRowid),
      message: 'Thank you for your review! It will appear on the website once approved by our team.'
    });
  } catch (error) {
    console.error('[Error: Submit Review]', error);
    return res.status(500).json({ success: false, error: 'Failed to submit review.' });
  }
});

// Admin: Get all reviews (pending, approved, rejected)
router.get('/all', authenticateToken, (req, res) => {
  try {
    const { status } = req.query;

    let query = 'SELECT * FROM customer_reviews';
    const params = [];

    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const reviews = stmt.all(...params);

    return res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    console.error('[Error: Admin Get Reviews]', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve all reviews.' });
  }
});

// Admin: Approve or Reject a review
router.patch('/:id/status', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status. Must be approved, rejected, or pending.' });
    }

    const updateStmt = db.prepare(`
      UPDATE customer_reviews 
      SET status = ?, approved_at = CASE WHEN ? = 'approved' THEN CURRENT_TIMESTAMP ELSE approved_at END
      WHERE id = ?
    `);

    const result = updateStmt.run(status, status, id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Review not found.' });
    }

    return res.json({ success: true, message: `Review status updated to '${status}'.` });
  } catch (error) {
    console.error('[Error: Update Review Status]', error);
    return res.status(500).json({ success: false, error: 'Failed to update review status.' });
  }
});

// Admin: Delete a review
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const deleteStmt = db.prepare('DELETE FROM customer_reviews WHERE id = ?');
    const result = deleteStmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Review not found.' });
    }

    return res.json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    console.error('[Error: Delete Review]', error);
    return res.status(500).json({ success: false, error: 'Failed to delete review.' });
  }
});

export default router;
