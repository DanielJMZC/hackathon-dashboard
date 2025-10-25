import {createMission, updateMissionStatus, getCompletedMissions, getAllMissions, getMissionById, getMissionsForUser} from '../models/missionModel.js';

async function runTests() {
  try {

    const rows = await getMissionsForUser(5);
    console.log(rows[0].name);
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

runTests();