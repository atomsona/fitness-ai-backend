import express from 'express';
import { createQuest, updateQuest, deleteQuest, getStatistics, getAllUsers } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect, admin);

router.get('/statistics', getStatistics);
router.get('/users', getAllUsers);
router.post('/quests', upload.single('image'), createQuest);
router.put('/quests/:id', upload.single('image'), updateQuest);
router.delete('/quests/:id', deleteQuest);

export default router;