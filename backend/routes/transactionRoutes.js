import express from 'express';
import * as transactionController from '../controllers/transactionController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /transactions/add
router.post('/add', authenticateToken, transactionController.addTransaction);

// GET /transactions/user/:id
router.get('/user/:id', authenticateToken, transactionController.getTransactionsByUser);

// PUT /transactions/update/:id
router.put('/update/:id', authenticateToken, transactionController.updateTransaction);

// DELETE /transactions/delete/:id
router.delete('/delete/:id', authenticateToken, transactionController.deleteTransaction);

export default router;
