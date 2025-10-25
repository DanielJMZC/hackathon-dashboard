import bcrypt from 'bcrypt';
import { db } from '../db.js';


export async function createUser(username, email, plainPassword) {
  const passwordHash = await hashPassword(plainPassword);

  const [result] = await db.query(
    'INSERT INTO users (name, email, hashed_password, xp, idLevel) VALUES (?, ?, ?, 0, 1)',
    [username, email, passwordHash]
  );

  return result.insertId;

}

async function hashPassword(plainPassword) {
  const hash = await bcrypt.hash(plainPassword, 10);
  return hash;
}

async function verifyPassword(plainPassword, hash) {
  return await bcrypt.compare(plainPassword, hash);
}

export async function getUserById(userId) {
  const [user] = await db.query(
    'SELECT * FROM users WHERE id = ?',
    [userId]
  );
}

export async function getUserByEmail(email) {
  const [user] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  return user[0];
}

export async function getAllUsers() {
   const [user] = await db.query(
    'SELECT * FROM users'
  );
}

export async
