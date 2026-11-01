import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'pahad_co_himalayan_jwt_secret_key_2026_super_secure';

// Admin Login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required.' });
    }

    const stmt = db.prepare('SELECT * FROM admins WHERE username = ?');
    const admin = stmt.get(username.trim());

    if (!admin) {
      return res.status(401).json({ success: false, error: 'Invalid username or password.' });
    }

    const isMatch = bcrypt.compareSync(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid username or password.' });
    }

    // Generate JWT token (expires in 24 hours)
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: admin.role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role
      },
      message: 'Signed in successfully.'
    });
  } catch (error) {
    console.error('[Error: Admin Login]', error);
    return res.status(500).json({ success: false, error: 'Server error during login.' });
  }
});

// Admin Profile Verification
router.get('/me', authenticateToken, (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

// Admin Dashboard KPI Stats
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const totalQueries = db.prepare('SELECT COUNT(*) as c FROM client_queries').get().c;
    const newQueries = db.prepare("SELECT COUNT(*) as c FROM client_queries WHERE status = 'new'").get().c;
    
    const totalReviews = db.prepare('SELECT COUNT(*) as c FROM customer_reviews').get().c;
    const pendingReviews = db.prepare("SELECT COUNT(*) as c FROM customer_reviews WHERE status = 'pending'").get().c;
    const approvedReviews = db.prepare("SELECT COUNT(*) as c FROM customer_reviews WHERE status = 'approved'").get().c;

    const totalFeedback = db.prepare('SELECT COUNT(*) as c FROM feedbacks').get().c;
    const newFeedback = db.prepare("SELECT COUNT(*) as c FROM feedbacks WHERE status = 'new'").get().c;

    const totalGallery = db.prepare('SELECT COUNT(*) as c FROM gallery_images').get().c;

    return res.json({
      success: true,
      stats: {
        queries: { total: totalQueries, new: newQueries },
        reviews: { total: totalReviews, pending: pendingReviews, approved: approvedReviews },
        feedback: { total: totalFeedback, new: newFeedback },
        gallery: { total: totalGallery }
      }
    });
  } catch (error) {
    console.error('[Error: Admin Stats]', error);
    return res.status(500).json({ success: false, error: 'Failed to compute dashboard stats.' });
  }
});

// Change Password
router.post('/change-password', authenticateToken, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters.' });
    }

    const stmt = db.prepare('SELECT * FROM admins WHERE id = ?');
    const admin = stmt.get(req.user.id);

    if (!admin || !bcrypt.compareSync(currentPassword, admin.password_hash)) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    const updateStmt = db.prepare('UPDATE admins SET password_hash = ? WHERE id = ?');
    updateStmt.run(hash, req.user.id);

    return res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('[Error: Change Password]', error);
    return res.status(500).json({ success: false, error: 'Failed to change password.' });
  }
});

export default router;
