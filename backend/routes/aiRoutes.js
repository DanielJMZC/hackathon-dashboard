import express from "express";
import { generateUserMissions, acceptMissionController } from "../controllers/aiController.js";
import {authenticateToken} from '../middleware/authMiddleware.js';


const router = express.Router();

// POST /api/AI
router.post("/model", authenticateToken, generateUserMissions);


// POST /api/AI/accept
router.post('/accept', authenticateToken, acceptMissionController);

export default router;