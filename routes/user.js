import express from 'express';
import { getProfile, updateProfile, updateAvatar } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/avatar', upload.single('avatar'), updateAvatar);

export default router;