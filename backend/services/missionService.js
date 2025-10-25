import {updateMissionStatus} from '../models/missionModel.js';
import {awardMissionXP, awardMissionGold} from '../services/transactionService.js';

export async function completeMission(userId, missionId) {
    updateMissionStatus(missionId, 'completed')
    awardMissionXP(userId, missionId);
    awardMissionGold(userId, missionId);
}

export async function getAllUserMissions(userId) {
    return await getMissionsForUser(userId);
}