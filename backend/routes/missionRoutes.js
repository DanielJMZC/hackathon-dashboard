import express from 'express';
import missionController from '../controllers/missionController.js';
import {authenticateToken} from '../middleware/authMiddleware.js';


const router = express.Router();

// PUT /missions/completeMission
router.put('/completeMission', authenticateToken, missionController.completeMission);

// GET /missions/
router.get('/users/:userId/missions', authenticateToken, missionController.getAllUserMissions);

export default router;
