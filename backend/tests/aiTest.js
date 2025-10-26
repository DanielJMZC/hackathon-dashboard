import {getUserQuests} from '../services/aiService.js';

async function runTests() {
  try {

    await getUserQuests()
   
  } catch (err) {
    console.error('Error:', err.message);
  }
}

runTests();