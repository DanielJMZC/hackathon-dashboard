import { db } from '../db.js';

export async function getLevelById(levelId) {
  try {
    const [rows] = await db.query(
      'SELECT * FROM level WHERE id = ?',
      [levelId]
    );

    if (rows.length === 0) {
      return null;
    }

  return rows[0]
  } catch (err) {
    console.error('Database error in getLevelById:', err.message);
    throw new Error('Failed to fetch level by id');
  }
}