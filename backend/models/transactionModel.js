import { db } from '../db.js';


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

