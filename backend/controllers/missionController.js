import * as missionService from '../services/missionService.js';


const completeMission = async(req, res) => {
    try {
        const {userId, missionId} = req.body;
        await missionService.completeMission(userId, missionId);
        res.status(200).json({message: 'Completed Mission'});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const getAllUserMissions = async(req, res) => {
    try {
        const {userId} = req.body;
        await missionService.getAllUserMissions(userId);
        res.status(200).json({message: 'Received all User missions'});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

export default {
    completeMission,
    getAllUserMissions
};
