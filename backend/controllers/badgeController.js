// controllers/badgeController.js
import * as badgeService from '../services/badgeService.js';

// 1️⃣ Listar todas las badges disponibles
export async function getAllBadges(req, res) {
  try {
    const badges = await badgeService.getAllBadges();
    res.status(200).json(badges);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// 2️⃣ Listar todas las badges de un usuario
export async function getUserBadges(req, res) {
  try {
    const { userId } = req.params; // se recibe por URL, ej: /users/:userId/badges
    const badges = await badgeService.getUserBadges(Number(userId));
    res.status(200).json(badges);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// 3️⃣ Asignar una badge a un usuario
export async function awardBadge(req, res) {
  try {
    const { userId, badgeId } = req.body; // se recibe por POST
    const result = await badgeService.awardBadgeToUser(Number(userId), Number(badgeId));
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// 4️⃣ Contar cuántas badges tiene un usuario
export async function countUserBadges(req, res) {
  try {
    const { userId } = req.params;
    const count = await badgeService.countUserBadges(Number(userId));
    res.status(200).json({ userId: Number(userId), badgeCount: count });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
