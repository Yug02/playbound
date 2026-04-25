const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, email, password, location } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, location });
    if (user) {
        res.status(201).json({
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            location: user.location, 
            isAdmin: user.isAdmin, 
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            isAdmin: user.isAdmin, 
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json(user); 
    } else {
        res.status(404).json({ message: 'User not found' }); 
    }
};

const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.location = req.body.location || user.location;
        user.skillLevel = req.body.skillLevel || user.skillLevel;
        user.preferredGames = req.body.preferredGames || user.preferredGames;
        user.availability = req.body.availability || user.availability;
        user.locationType = req.body.locationType || user.locationType;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const deleteUserAccount = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        if (user.isAdmin) {
            return res.status(400).json({ 
                message: 'Admins cannot delete their own accounts. Demote this account in the database first.' 
            });
        }
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User account deleted successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const searchPlayers = async (req, res) => {
    const { game, skillLevel, location, availability } = req.query;
    let query = { _id: { $ne: req.user._id } };
    
    // Using regex so partial matches work (e.g., typing "Foot" finds "Football")
    if (game) query.preferredGames = { $regex: game, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' }; 
    if (skillLevel) query.skillLevel = skillLevel;
    if (availability) query.availability = availability;
    
    const players = await User.find(query);
    res.json(players);
};

const getAllUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

const deleteUserById = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if (user.isAdmin) {
            return res.status(400).json({ 
                message: 'Cannot delete an Admin account. Demote them in the database first.' 
            });
        }
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed by Admin' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile, 
    deleteUserAccount, 
    searchPlayers, 
    getAllUsers, 
    deleteUserById 
};