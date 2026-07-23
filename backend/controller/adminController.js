const userModel = require('../models/userModels.js');

const getUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Fetch Users Failure:', error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const affected = await userModel.deleteUser(req.params.id);
        if (!affected) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Delete User Failure:', error);
        res.status(500).json({ message: 'Server error deleting user' });
    }
};

const getStats = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).json({
            totalUsers: users.length,
            studentsCount: users.filter(u => u.role === 'student').length,
            organizersCount: users.filter(u => u.role === 'organizer').length,
        });
    } catch (error) {
        console.error('Fetch Stats Failure:', error);
        res.status(500).json({ message: 'Server error compiling dashboard metrics' });
    }
};

module.exports = { getUsers, deleteUser, getStats };