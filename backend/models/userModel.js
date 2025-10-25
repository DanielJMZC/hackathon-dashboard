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
