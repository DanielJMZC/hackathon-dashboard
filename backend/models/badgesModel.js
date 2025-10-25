import bcrypt from 'bcrypt';
import { db } from '../db.js';


export async function createBadge(userId, description, name, icon_url) {
try {
  const [result] = await db.query(
    'INSERT INTO badges (user_id, description, name, icon_url, earned_at) VALUES (?, ?, ?, ?, NOW())',
    [userId, description, name, icon_url]
  );

  return result.insertId;
} catch (err) {
  console.error('Database error in createBadge:', err.message);
  throw new Error('Failed to create badge')
}
}


// Obtener una badge por su ID
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

// Obtener todas las badges de un usuario
export async function getBadgesByUser(userId) {
  try {
    const [rows] = await db.query(
      'SELECT * FROM badges WHERE user_id = ? ORDER BY earned_at DESC',
      [userId]
    );
    return rows;
  } catch (err) {
    console.error('Database error in getBadgesByUser:', err.message);
    throw new Error('Failed to get badges for user');
  }
}

// Obtener todas las badges (catálogo)
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

// Verificar si un usuario ya tiene una badge por nombre
export async function hasUserBadge(userId, badgeName) {
  try {
    const [rows] = await db.query(
      'SELECT 1 FROM badges WHERE user_id = ? AND name = ? LIMIT 1',
      [userId, badgeName]
    );
    return rows.length > 0;
  } catch (err) {
    console.error('Database error in hasUserBadge:', err.message);
    throw new Error('Failed to check user badge');
  }
}

// Contar cuántas badges tiene un usuario
export async function countUserBadges(userId) {
  try {
    const [rows] = await db.query(
      'SELECT COUNT(*) as total FROM badges WHERE user_id = ?',
      [userId]
    );
    return rows[0].total;
  } catch (err) {
    console.error('Database error in countUserBadges:', err.message);
    throw new Error('Failed to count user badges');
  }
}