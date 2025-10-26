import {getAIResponse} from '../services/aiService.js';

async function runTests() {
  try {

    getAIResponse('Testing Testing! Reply back!')
    .then(string => console.log(string))
    .catch(err => console.error(err));
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

runTests();