import {addTransaction, awardMissionXP, getUserTransactions, updateTransaction} from '../models/transactionModel.js';


async function runTests() {
  try {
    awardMissionXP(5, 2);

  } catch (err) {
    console.error('Error:', err.message);
  }
}

runTests();