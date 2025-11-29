import express from 'express';
import passport from '../config/passport.js';


import {
  register,
  login,
  refresh,
  logout,
  googleCallback
} from '../controllers/authController.js';


import { protect } from '../middleware/auth.js';

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);


router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleCallback
);

export default router;
