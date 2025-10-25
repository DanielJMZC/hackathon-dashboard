import bcrypt from 'bcrypt';
import { db } from '../db.js';

export async function createMission(userId, description, rewardXp, rewardGold, name, expiration) {
try {
  const [result] = await db.query(
    'INSERT INTO mission (user_id, description, reward_xp, status, reward_gold, created_at, completed_at, name, expiration_in) VALUES (?, ?, ?, on_going, false, ?, NOW(), NULL, ?, ?)',
    [userId, description, rewardXp, rewardGold, name, expiration]
  );

  return result.insertId;
} catch (err) {
  console.error('Database error in createMission:', err.message);
  throw new Error('Failed to create mission')
}
}

export async function getAllMissions() {
  try {
    const [rows] = await db.query('SELECT * FROM mission');
    return rows;
  } catch (err) {
    console.error('Database error in getAllMissions:', err.message);
    throw new Error('Failed to get all missions')
  }
}

export async function getMissionById(missionId){
  try {
      const [rows] = await db.query(
      'SELECT * FROM mission WHERE id = ?',
      [missionId]
      );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (err) {
    console.error('Database error in getMissionById:', err.message);
    throw new Error('Failed to get mission')
  }
}

export async function getMissionsForUser(userId){
  try {
    const [rows] = await db.query(
      'SELECT * FROM mission WHERE user_id = ?',
      [userId]
      );

    return rows;
  } catch (err) {
    console.error('Database error in getMissionsForUser:', err.message);
    throw new Error('Failed to get mission')
  }
}

export async function updateMission(missionId, name, rewardXp, rewardGold, description, status, completed_at, expiration) {
  try {
    const [result] = await db.query(
      `UPDATE mission 
      SET name = ?, 
          reward_xp = ?, 
          reward_gold = ?, 
          description = ?, 
          status = ?, 
          completed_at = ?,
          expiration_in = ?
      WHERE id = ?`,
      [name, rewardXp, rewardGold, description, status, completed_at, expiration, missionId]
    );

    return result.affectedRows > 0; // Devuelve true si se actualizó alguna fila
  } catch (err) {
    console.error('Database error in updateMission:', err.message);
    throw new Error('Failed to update mission')
  }
}

export async function updateMissionStatus(user_id, missionId, status){
  
}

export async function deleteMission(missionId){

}

export async function assignMissionToUser(userId, missionId){

}

export async function getCompletedMissions(userID){

}

export async function awardMissionReward(userId, missionId){

}