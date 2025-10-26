import {sendMessage} from '../services/aiService.js';

async function runTests() {
  try {

    await sendMessage(9, 'any quests for today');
   
  } catch (err) {
    console.error('Error:', err.message);
  }
}

runTests();