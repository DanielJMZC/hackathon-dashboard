import {getMissionById} from '../models/missionModel.js';
import {getUserById} from '../models/userModel.js';
import {addTransaction} from '../models/transactionModel.js';
import {awardXP, awardGold} from '../services/userService.js';




export async function awardMissionXP(userId, missionId) {
  const mission = await getMissionById(missionId);
  const string = 'Completed the Mission: ' + mission.name + ' -XP';
  const user = await getUserById(userId);

  const rows = await addTransaction(userId, 1, mission.reward_xp, string, missionId);
  user.xp += mission.reward_xp;
  await awardXP(userId, mission.reward_xp);
}

export async function awardMissionGold(userId, missionId) {
    const mission = await getMissionById(missionId);
    const string = 'Completed the Mission: ' + mission.name + ' -Gold';
    const user = await getUserById(userId);

  const rows = await addTransaction(userId, 1, mission.reward_gold, string, missionId);
  user.gold += mission.reward_gold;
  await awardGold(userId, mission.reward_gold);
}