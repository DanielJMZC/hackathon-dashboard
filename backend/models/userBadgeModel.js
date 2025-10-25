import { db } from '../db.js';

//////////////////////
// Asignar una badge a un usuario
export async function awardBadge(userId, badgeId) {
  try {
    const [rows] = await db.query(
      'SELECT 1 FROM user_badges WHERE user_id = ? AND badge_id = ? LIMIT 1',
      [userId, badgeId]
    );
    if (rows.length > 0) {
      return { success: false, message: 'Usuario ya tiene esta badge' };
    }

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
