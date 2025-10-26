import express from 'express';
import missionController from '../controllers/missionController.js';

const router = express.Router();

// PUT /missions/completeMission
router.post('/completeMission', missionController.completeMission);

// GET /missions/
router.get('users/:userId/missions', missionController.getAllUserMissions);

export default router;
