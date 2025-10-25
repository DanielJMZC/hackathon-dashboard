import {completeMission} from '../services/missionService.js';

async function runTests() {
  try {
    completeMission(5, 2);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

runTests();