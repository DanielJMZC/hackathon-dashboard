import { getUserQuests, acceptMission} from "../services/aiService.js";

export const generateUserMissions = async (req, res) => {
  try {
    const userId = req.user.id; 
    const message = req.body.message;
    const missions = await getUserQuests(userId, message);
    res.json({ success: true, data: missions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export async function acceptMissionController(req, res) {
  try {
    const userId = req.user.id;         
    const aiResponse = req.body.aiResponse;  

    if (!aiResponse || !aiResponse.missions || aiResponse.missions.length === 0) {
      return res.status(400).json({ error: 'No mission to accept' });
    }

    const savedMission = await acceptMission(userId, aiResponse);

    return res.status(200).json({ mission: savedMission });
  } catch (err) {
    console.error('Error in acceptMissionController:', err);
    return res.status(500).json({ error: 'Failed to accept mission' });
  }
}