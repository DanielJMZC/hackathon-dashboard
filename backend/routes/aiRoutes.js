import express from "express";
import { generateUserMissions, acceptMissionController } from "../controllers/aiController.js";
import {authenticateToken} from '../middleware/authMiddleware.js';


const router = express.Router();

// POST /api/AI
router.post("/AI", authenticateToken, generateUserMissions);


// POST /api/missions/accept/:userId
router.post('/accept', authenticateToken, acceptMissionController);

export default router;