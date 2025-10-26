import * as userService from '../services/userService.js';

const register = async(req, res) => {
    try {
        const {name, email, password} = req.body;
        await userService.registerUser(name, email, password);
        res.status(200).json({message: 'Registered succesfully'});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

const login = async(req, res) => {
    try {
        const {email, password} = req.body;
        const result = await userService.loginUser(email, password);
        res.status(200).json(result);
    } catch (err) {
    res.status(400).json({error: err.message});
    }
};

const addXP = async(req, res) => {
    try {
        const {id} = req.params;
        const {xp} = req.body;
        await userService.awardXP(id, xp);
        res.status(200).json({message: 'XP succesfully added'});
    } catch (err) {
    res.status(400).json({error: err.message});
    }
};

const addGold = async(req, res) => {
    try {
        const {id} = req.params;
        const {gold} = req.body;
        await userService.awardGold(id, gold);
        res.status(200).json({message: 'Gold succesfully added'});

    } catch (err) {
    res.status(400).json({error: err.message});
    }
};

const getUser = async(req, res) => {
    try {
        const {id} = req.params;
        await userService.getUser(id);
        res.status(200).json({message: 'User succesfully sent'});
    } catch (err) {
    res.status(400).json({error: err.message});
    }
};

export default {
    register,
    login,
    addXP,
    addGold,
    getUser
}
