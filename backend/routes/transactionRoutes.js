import express from 'express';
import transactionController from '../controllers/transactionController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /transactions/add
router.post('/users/me/xp', authenticateToken, transactionController.awardMissionXP);

// POST /transactions/add
router.post('/users/me/gold', authenticateToken, transactionController.awardMissionGold);

// GET /transactions/update/:id
router.get('/users/me/transactions', authenticateToken, transactionController.getTransactionByUser);

export default router;
