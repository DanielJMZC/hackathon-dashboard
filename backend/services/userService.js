import { db } from '../db.js';
import {createUser, getUserByEmail, updateXP, updateLevel, updateDate, verifyPassword, getUserById} from '../models/userModel.js';
import {getLevelById} from '../models/levelModel.js';



import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN

export async function awardXP(userId, xp) {
   try {

    const [rows] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    const user = rows[0];

    if (!user) {
        throw new Error('User not found');
    }

    user.xp += xp;

    const [results] = await db.query(
      'UPDATE users SET xp = ? WHERE id = ?',
      [user.xp, userId]
    );

    if (results.affectedRows === 0) {
      throw new Error('User not found or no changes made');
    }

    let level = await getLevelById(user.idLevel + 1);
      while ((user.xp >= level.xp_needed) && level) {
        const xp = user.xp;
        const newXP = user.xp - level.xp_needed;
        user.xp = newXP;
        await updateXP(userId, newXP);
        user.idLevel += 1;
        await updateLevel(userId, user.idLevel);
        level = await getLevelById(user.idLevel + 1);
      }

    await updateDate(userId);

  } catch (err) {
      console.error('Database error in awardXPr:', err.message);
      throw new Error('Failed to award XP');
  }
}

export async function awardGold(userId, gold) {
   try {
     const [rows] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    const user = rows[0];

    if (!user) {
        throw new Error('User not found');
    }

    user.gold += gold;

    const [results] = await db.query(
      'UPDATE users SET gold = ? WHERE id = ?',
      [user.gold, userId]
    );

    if (results.affectedRows === 0) {
      throw new Error('User not found or no changes made');
    }
    

    await updateDate(userId);

  } catch (err) {
      console.error('Database error in updateUser:', err.message);
      throw new Error('Failed to award money');
  }
}

export async function awardMoney(userId, money) {
   try {
     const [rows] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    const user = rows[0];

    if (!user) {
        throw new Error('User not found');
    }

    user.balance += money;

    const [results] = await db.query(
      'UPDATE users SET balance = ? WHERE id = ?',
      [user.balance, userId]
    );

    if (results.affectedRows === 0) {
      throw new Error('User not found or no changes made');
    }

    await updateDate(userId);

  } catch (err) {
      console.error('Database error in updateUser:', err.message);
      throw new Error('Failed to award money');
  }
}

export async function registerUser(username, email, password) {
    const id = await createUser(username, email, password);
    return id;
}

export async function loginUser(email, password) {
    const user = await getUserByEmail(email);
    if (!user) {
        throw new Error('Invalid Credentials');
    }

    const isValid = await verifyPassword(password, user.hashed_password);
    if (!isValid) {
        throw new Error('Invalid Credentials');
    }

    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        level: user.idLevel,
    };

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

    return {
        token,
        user: {
            id:user.id,
            name: user.name,
            email: user.email,
            level: user.idLevel
        }
    };
}

export async function getUser(userId) {
    return getUserById(userId);
}
