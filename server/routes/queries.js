import express from 'express';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import { rateLimitSubmissions, isValidEmail, isValidPhone } from '../middleware/validate.js';

const router = express.Router();

// Public: Submit Client Query
router.post('/', rateLimitSubmissions(60000, 5), (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      eventType,
      preferredDate,
      eventLocation,
      estimatedBudget,
      message
    } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Full name is required (at least 2 characters).' });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ success: false, error: 'Valid 10-digit phone number is required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'Valid email address is required.' });
    }

    if (!eventType || typeof eventType !== 'string') {
      return res.status(400).json({ success: false, error: 'Event type is required.' });
    }

    if (!preferredDate) {
      return res.status(400).json({ success: false, error: 'Preferred event date is required.' });
    }

    if (!eventLocation || typeof eventLocation !== 'string') {
      return res.status(400).json({ success: false, error: 'Event location is required.' });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({ success: false, error: 'Event message/requirements must be at least 10 characters.' });
    }

    const insertStmt = db.prepare(`
      INSERT INTO client_queries (
        name, phone, email, event_type, preferred_date, event_location, estimated_budget, message, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')
    `);

    const result = insertStmt.run(
      name.trim(),
      phone.trim(),
      email.trim().toLowerCase(),
      eventType.trim(),
      preferredDate,
      eventLocation.trim(),
      estimatedBudget || 'Not specified',
      message.trim()
    );

    return res.status(201).json({
      success: true,
      id: Number(result.lastInsertRowid),
      message: 'Your inquiry has been successfully received by the PAHAD.co management desk in Dehradun.'
    });
  } catch (error) {
    console.error('[Error: Submit Query]', error);
    return res.status(500).json({ success: false, error: 'Failed to process inquiry. Please try again.' });
  }
});

// Admin: Get all queries
router.get('/', authenticateToken, (req, res) => {
  try {
    const { status, search } = req.query;

    let query = 'SELECT * FROM client_queries';
    const params = [];

    const conditions = [];
    if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status);
    }

    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR event_location LIKE ? OR event_type LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term, term, term);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const queries = stmt.all(...params);

    return res.json({ success: true, count: queries.length, data: queries });
  } catch (error) {
    console.error('[Error: Get Queries]', error);
    return res.status(500).json({ success: false, error: 'Failed to retrieve queries.' });
  }
});

// Admin: Update query status / notes
router.patch('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const findStmt = db.prepare('SELECT id FROM client_queries WHERE id = ?');
    const existing = findStmt.get(id);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Query not found.' });
    }

    const updates = [];
    const params = [];

    if (status) {
      const validStatuses = ['new', 'contacted', 'in_progress', 'completed', 'archived'];
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
      return res.status(400).json({ success: false, error: 'No fields to update provided.' });
    }

    params.push(id);
    const updateStmt = db.prepare(`UPDATE client_queries SET ${updates.join(', ')} WHERE id = ?`);
    updateStmt.run(...params);

    return res.json({ success: true, message: 'Client query updated successfully.' });
  } catch (error) {
    console.error('[Error: Update Query]', error);
    return res.status(500).json({ success: false, error: 'Failed to update query.' });
  }
});

// Admin: Delete a query
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const deleteStmt = db.prepare('DELETE FROM client_queries WHERE id = ?');
    const result = deleteStmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Query not found.' });
    }

    return res.json({ success: true, message: 'Query removed from records.' });
  } catch (error) {
    console.error('[Error: Delete Query]', error);
    return res.status(500).json({ success: false, error: 'Failed to delete query.' });
  }
});

export default router;
