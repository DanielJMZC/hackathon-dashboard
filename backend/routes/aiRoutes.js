import express from "express";
import { generateUserMissions } from "../controllers/aiController.js";

const router = express.Router();

// POST /api/AI
router.post("/AI", generateUserMissions);

export default router;