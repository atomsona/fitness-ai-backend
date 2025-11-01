import express from 'express';
import passport from '../config/passport.js';
import { register, login, refresh, logout, googleCallback } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);

// Google OAuth routes - only enable if configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
  router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);
} else {
  // Return error if Google OAuth is not configured
  router.get('/google', (req, res) => {
    res.status(503).json({ 
      message: 'Google OAuth is not configured on this server',
      code: 'OAUTH_NOT_CONFIGURED'
    });
  });
  router.get('/google/callback', (req, res) => {
    res.status(503).json({ 
      message: 'Google OAuth is not configured on this server',
      code: 'OAUTH_NOT_CONFIGURED'
    });
  });
}

export default router;