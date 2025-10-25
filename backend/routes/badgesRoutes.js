import express from 'express';
import * as badgeController from '../controllers/badgeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /badges/all - listar todas las badges disponibles
router.get('/all', authenticateToken, badgeController.getAllBadges);

// GET /badges/user/:id - listar badges que un usuario ha obtenido
router.get('/user/:id', authenticateToken, badgeController.getUserBadges);

// POST /badges/award - otorgar una badge a un usuario
router.post('/award', authenticateToken, badgeController.awardBadge);

export default router;
