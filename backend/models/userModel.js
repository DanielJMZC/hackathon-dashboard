import bcrypt from 'bcrypt';
import { db } from '../db.js';


export async function createUser(username, email, plainPassword) {
  try {
    const passwordHash = await hashPassword(plainPassword);
    const now = new Date();

    const [result] = await db.query(
      'INSERT INTO users (name, email, hashed_password, xp, idLevel, gold, created_at, updated_at, balance) VALUES (?, ?, ?, 0, 1, 0, ?, ?, 0)',
      [username, email, passwordHash, now, now]
    );

    return result.insertId;
  } catch (err) {
     console.error('Database error in createUser:', err.message);
    throw new Error('Failed to create user');
  }

}

async function hashPassword(plainPassword) {
  const hash = await bcrypt.hash(plainPassword, 10);
  return hash;
}

export async function verifyPassword(plainPassword, hash) {
  return await bcrypt.compare(plainPassword, hash);
}

export async function getUserById(userId) {
  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return null;
    }

  return rows[0]
  } catch (err) {
    console.error('Database error in getUserById:', err.message);
    throw new Error('Failed to fetch user by id');
  }
}

export async function getUserByEmail(email) {
  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0]
  } catch (err) {
    console.error('Database error in getUserByEmail:', err.message);
    throw new Error('Failed to fetch user by email');
  }
}

export async function getAllUsers() {
  try {
    const [rows] = await db.query(
      'SELECT * FROM users',
    );

    return rows
  } catch (err) {
    console.error('Database error in getAllUsers:', err.message);
    throw new Error('Failed to fetch all users');
  }
}

export async function updateUser(userId, updates) {
  try {
    const [results] = await db.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [updates.name, updates.email, userId]
    );

    if (results.affectedRows === 0) {
      throw new Error('User not found or no changes made');
    }

    await updateDate(userId);
  } catch (err) {
      console.error('Database error in updateUser:', err.message);
      throw new Error('Failed to update user');
  }
}

export async function updateXP(userId, xp) {
   try {

    const [rows] = await db.query(
      'SELECT xp FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
        throw new Error('User not found');
    }

    const [results] = await db.query(
      'UPDATE users SET xp = ? WHERE id = ?',
      [xp, userId]
    );

    if (results.affectedRows === 0) {
      throw new Error('User not found or no changes made');
    }

    await updateDate(userId);

    return xp;

  } catch (err) {
      console.error('Database error in updateUser:', err.message);
      throw new Error('Failed to update user');
  }
}

export async function updateLevel(userId, idLevel) {
  try {
    const [results] = await db.query(
      'UPDATE users SET idLevel = ? WHERE id = ?',
      [idLevel, userId]
    );

    if (results.affectedRows === 0) {
      throw new Error('User not found or no changes made');
    }

    await updateDate(userId);

  } catch (err) {
      console.error('Database error in updateUser:', err.message);
      throw new Error('Failed to update user');
  }

}

export async function changePassword(userId, newPassword) {
  try {
    const hash = await bcrypt.hash(newPassword, 10);

    const [results] = await db.query(
      'UPDATE users SET hashed_password = ? WHERE id = ?',
      [hash, userId]
    );

    if (results.affectedRows === 0) {
      throw new Error('User not found or no changes made');
    }

    await updateDate(userId);

  } catch (err) {
      console.error('Database error in changePassword:', err.message);
      throw new Error('Failed to change password');
  }
}

export async function deleteUser(userId) {
  try {

    const [results] = await db.query(
      'DELETE FROM users WHERE id = ?',
      [userId]
    );


    if (results.affectedRows === 0) {
      throw new Error('User not found or no changes made');
    }

  } catch (err) {
      console.error('Database error in deleteUser:', err.message);
      throw new Error('Failed to delete user');
  }

}

export async function updateDate(userId) {
  try {
    const now = new Date();

    const [rows] = await db.query(
      'UPDATE users SET updated_at = ? WHERE id = ?',
      [now, userId]
    );

    if (rows.affectedRows === 0) {
        throw new Error('User not found or no changes made');
      }
  } catch (err) {
      console.error('Database error in updateDate:', err.message);
      throw new Error('Failed to update date');
  }
}

