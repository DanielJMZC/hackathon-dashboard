import express from 'express';
import userController from '../controllers/userController.js';
import {authenticateToken} from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /users/register
router.post('/register', userController.register);

// POST /users/login
router.post('/login', userController.login);

// PUT /users/xp
router.post('/:id/xp', authenticateToken, userController.addXP);

// PUT /users/gold
router.put('/:id/gold', authenticateToken, userController.addGold);

// GET /users/:id
router.get('/me', authenticateToken, userController.getUser);

export default router;

