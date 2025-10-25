import bcrypt from 'bcrypt';
import { db } from '../db.js';

//////////////////////
// Crear badge (solo catálogo)
export async function createBadge(name, description, icon_url) {
  try {
    const [result] = await db.query(
      'INSERT INTO badges (name, description, icon_url) VALUES (?, ?, ?)',
      [name, description, icon_url]
    );
    return result.insertId;
  } catch (err) {
    console.error('Database error in createBadge:', err.message);
    throw new Error('Failed to create badge');
  }
}

//////////////////////
// Obtener badge por ID
export async function getBadgeById(badgeId) {
  try {
    const [rows] = await db.query(
      'SELECT * FROM badges WHERE id = ?',
      [badgeId]
    );
    return rows[0] || null;
  } catch (err) {
    console.error('Database error in getBadgeById:', err.message);
    throw new Error('Failed to get badge');
  }
}

//////////////////////
// Obtener todas las badges del catálogo
export async function getAllBadges() {
  try {
    const [rows] = await db.query(
      'SELECT * FROM badges ORDER BY name ASC'
    );
    return rows;
  } catch (err) {
    console.error('Database error in getAllBadges:', err.message);
    throw new Error('Failed to get all badges');
  }
}

//////////////////////
// Obtener todas las badges de un usuario
export async function getBadgesByUser(userId) {
  try {
    const [rows] = await db.query(
      `SELECT b.*, ub.earned_at
       FROM badges b
       JOIN user_badges ub ON b.id = ub.badge_id
       WHERE ub.user_id = ?
       ORDER BY ub.earned_at DESC`,
      [userId]
    );
    return rows;
  } catch (err) {
    console.error('Database error in getBadgesByUser:', err.message);
    throw new Error('Failed to get badges for user');
  }
}

//////////////////////
// Verificar si un usuario ya tiene una badge
export async function hasUserBadge(userId, badgeId) {
  try {
    const [rows] = await db.query(
      'SELECT 1 FROM user_badges WHERE user_id = ? AND badge_id = ? LIMIT 1',
      [userId, badgeId]
    );
    return rows.length > 0;
  } catch (err) {
    console.error('Database error in hasUserBadge:', err.message);
    throw new Error('Failed to check user badge');
  }
}

//////////////////////
// Contar cuántas badges tiene un usuario
export async function countUserBadges(userId) {
  try {
    const [rows] = await db.query(
      'SELECT COUNT(*) AS total FROM user_badges WHERE user_id = ?',
      [userId]
    );
    return rows[0].total;
  } catch (err) {
    console.error('Database error in countUserBadges:', err.message);
    throw new Error('Failed to count user badges');
  }
}

//////////////////////
// Asignar badge a un usuario (award)
export async function awardBadge(userId, badgeId) {
  try {
    // Evitar duplicados
    const [rows] = await db.query(
      'SELECT 1 FROM user_badges WHERE user_id = ? AND badge_id = ? LIMIT 1',
      [userId, badgeId]
    );
    if (rows.length > 0) {
      return { success: false, message: 'Usuario ya tiene esta badge' };
    }

    // Crear nueva asignación
    const [result] = await db.query(
      'INSERT INTO user_badges (user_id, badge_id, earned_at) VALUES (?, ?, NOW())',
      [userId, badgeId]
    );

    return { success: true, message: 'Badge otorgada', userBadgeId: result.insertId };
  } catch (err) {
    console.error('Database error in awardBadge:', err.message);
    throw new Error('Failed to award badge');
  }
}
