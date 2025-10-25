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
