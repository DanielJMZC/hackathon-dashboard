import { db } from '../db.js';
import * as badgesModel from '../models/badgesModel.js';
import * as userBadgesModel from '../models/userBadgeModel.js';

//////////////////////////////
// Asignar una badge a un usuario
export async function awardBadgeToUser(userId, badgeId) {
  // 1. Verificar que la badge existe
  const badge = await badgesModel.getBadgeById(badgeId);
  if (!badge) throw new Error('Badge no existe');

  // 2. Verificar que el usuario no tenga ya la badge
  const alreadyHas = await userBadgesModel.hasUserBadge(userId, badgeId);
  if (alreadyHas) return { success: false, message: 'Usuario ya tiene esta badge' };

  // 3. Asignar la badge
  return await userBadgesModel.awardBadge(userId, badgeId);
}

//////////////////////////////
// Obtener todas las badges de un usuario
export async function getUserBadges(userId) {
  return await userBadgesModel.getBadgesByUser(userId);
}

//////////////////////////////
// Obtener todas las badges del catálogo
export async function getAllBadges() {
  return await badgesModel.getAllBadges();
}

//////////////////////////////
// Contar cuántas badges tiene un usuario
export async function countUserBadges(userId) {
  return await userBadgesModel.countUserBadges(userId);
}

export async function checkAndAwardType1Badge(userId) {
  try {

    const [existingBadge] = await db.query(
      `SELECT * FROM user_badges WHERE user_id = ? AND badge_id = ?`,
      [userId, 1]
    );
    if (existingBadge.length > 0) {
      return null; // already awarded
    }

    const [completedMissions] = await db.query(
      `SELECT COUNT(*) AS total FROM missions WHERE user_id = ? AND status = ?`,
      [userId, 'completed']
    );

    if (completedMissions[0].total <= 1) {
      return null; 
    }


    const [result] = await db.query(
      `INSERT INTO user_badges (user_id, badge_id, awarded_at) VALUES (?, ?, ?)`,
      [userId, 1, new Date()]
    );

    console.log(`Type 1 badge awarded to user ${userId}`);
    return { badgeId: 1, userId };

  } catch (err) {
    console.error("Error awarding Type 1 badge:", err);
    throw err;
  }
}
