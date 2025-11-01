import express from 'express';
import { getAllQuests, getQuestById, completeQuest, getUserProgress } from '../controllers/questController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllQuests);
router.get('/progress', protect, getUserProgress);
router.get('/:id', getQuestById);
router.post('/:id/complete', protect, completeQuest);

export default router;