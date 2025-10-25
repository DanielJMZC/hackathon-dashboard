import express from 'express';
import transactionController from '../controllers/transactionController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /transactions/add
router.post('/users/:user_id/xp', authenticateToken, transactionController.awardMissionXP);

// POST /transactions/add
router.post('/users/:user_id/gold', authenticateToken, transactionController.awardMissionGold);

// GET /transactions/update/:id
router.get('/users/:user_id/transactions', authenticateToken, transactionController.getTransactionByUser);

export default router;
