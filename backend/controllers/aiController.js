import { getUserQuests } from "../services/aiService.js";

export const generateUserMissions = async (req, res) => {
  try {
    const { userId, message } = req.body;
    const missions = await getUserQuests(userId, message);
    res.json({ success: true, data: missions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};