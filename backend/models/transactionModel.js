import { db } from '../db.js';
import {getMissionById} from '../models/missionModel.js';
import {updateXP, updateLevel, getUserById, awardXP} from '../models/userModel.js';
import {getLevelById} from '../models/levelModel.js';


export async function addTransaction(userId, type_id, amount, description, missionId) {
    try {
    const now = new Date();
    const [result] = await db.query(
        'INSERT INTO transactions (user_id, type_id, amount, description, mission_id, date) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, type_id, amount, description, missionId, now]
    );

    return result.id;
    } catch (err) {
    console.error('Database error in addTransaction:', err.message);
    throw new Error('Failed to add Transaction')
    }
}

export async function getUserTransactions(userId) {
     try {
      const [rows] = await db.query(
      'SELECT * FROM transactions WHERE user_id = ?',
      [userId]
      );

    if (rows.length === 0) {
      return null;
    }

    return rows;
  } catch (err) {
    console.error('Database error in getUsertransactions:', err.message);
    throw new Error('Failed to get user transactions')
  }
}

export async function updateTransaction(transactionId, newAmount, newDescription) {
  try {
    const [result] = await db.query(
      `UPDATE transactions SET amount = ?, description = ? WHERE id = ?`,
      [newAmount, newDescription, transactionId]
    );

    return result.affectedRows > 0;

  } catch (err) {
    console.error('Database error in updateTransaction:', err.message);
    throw new Error('Failed to update transaction')
  }
}

export async function deleteTransaction(transactionId) {
  try {
    const [results] = await db.query(
        'DELETE FROM transactions WHERE id = ?',
        [transactionId]
      );


      if (results.affectedRows === 0) {
        throw new Error('User not found or no changes made');
      }

  } catch (err) {
    console.error('Database error in deleteTransaction:', err.message);
    throw new Error('Failed to delete transaction')
  }

}

export async function awardMissionXP(userId, missionId) {
  const mission = await getMissionById(missionId);
  const string = 'Completed the Mission: ' + mission.name;
  const user = await getUserById(userId);

  const rows = await addTransaction(userId, 1, mission.reward_xp, string, missionId);
  user.xp += mission.reward_xp;
  await awardXP(userId, mission.reward_xp);
  let level = await getLevelById(user.idLevel);
  while ((user.xp >= level.xp_needed) && level) {
    const xp = user.xp;
    const newXP = user.xp - level.xp_needed;
    user.xp = newXP;
    await updateXP(userId, newXP);
    user.idLevel += 1;
    await updateLevel(userId, user.idLevel);
    level = await getLevelById(user.idLevel);
  }
}