import * as userService from '..services/userService.js';

export async function register(req, res) {
    try {
        const {username, email, password} = req.body;
        await userService.registerUser(username, email, password);
        res.status(200).json({message: 'Registered succesfully'});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

export async function login(req, res) {
    try {
        const {email, password} = req.body;
        const result = await userService.loginUser(email, password);
        res.status(200).json(result);
    } catch (err) {
    res.status(400).json({error: err.message});
    }
}

export async function addXP(req, res) {
    try {
        const {userId, xp} = req.body;
        await userService.awardService(userId, xp);
        res.status(200).json({message: 'XP succesfully added'});
    } catch (err) {
    res.status(400).json({error: err.message});
    }
}

export async function addGold(req, res) {
    try {
        const {userId, gold} = req.body;
        await userService.awardService(userId, gold);
        res.status(200).json({message: 'Gold succesfully added'});

    } catch (err) {
    res.status(400).json({error: err.message});
    }
}

export async function getUser(req, res) {
    try {
        const {userId} = req.body;
        await userService.getUser(userId);
        res.status(200).json({message: 'User succesfully sent'});
    } catch (err) {
    res.status(400).json({error: err.message});
    }
}
