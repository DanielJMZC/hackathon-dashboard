import express from 'express';
import * as missionController from '../controllers/userController.js';

const router = express.Router();

// PUT /missions/completeMission
router.post('/completeMission', missionController.completeMission());

// GET /missions/
router.get('users/:userId/missions', missionController.getAllUserMissions());

export default router;
