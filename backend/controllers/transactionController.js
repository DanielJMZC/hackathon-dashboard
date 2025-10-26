import * as transactionService from '../services/transactionService.js';

const awardMissionXP = async(req, res) => {
  try {
    const userId = req.user.id;
    const { missionId } = req.body;
    await transactionService.awardMissionXP(userId, missionId);
    res.status(200).json({ message: 'XP awarded successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const awardMissionGold = async(req, res) => {
  try {
    const userId = req.user.id;
    const { missionId } = req.body;
    await transactionService.awardMissionGold(userId, missionId);
    res.status(200).json({ message: 'Gold awarded successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

const awardSimulatorMoney = async(req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    const transaction = await transactionService.moneySimulatorTransaction(userId, amount);

    console.log('Transaction added:', transaction);

    res.status(200).json({ message: 'Transaction added', transaction });
  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
};


const getTransactionByUser = async(req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await transactionService.getTransactionsByUser(userId);
    res.status(200).json(transactions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export default {
  awardMissionXP,
  awardMissionGold,
  awardSimulatorMoney,
  getTransactionByUser
}

