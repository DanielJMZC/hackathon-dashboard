import * as transactionService from '../services/transactionsService.js';

export async function awardMissionXP(req, res) {
  try {
    const { userId, missionId } = req.body;
    await transactionService.awardMissionXP(userId, missionId);
    res.status(200).json({ message: 'XP awarded successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function awardMissionGold(req, res) {
  try {
    const { userId, missionId } = req.body;
    await transactionService.awardMissionGold(userId, missionId);
    res.status(200).json({ message: 'Gold awarded successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


export async function getTransactionsByUser(req, res) {
  try {
    const { userId } = req.params;
    const transactions = await transactionService.getTransactionsByUser(userId);
    res.status(200).json(transactions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

