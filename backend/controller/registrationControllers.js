const registrationModel = require('../models/registrationModels.js');

const register = async (req, res) => {
    try {
        const { eventId } = req.body;
        if (!eventId) return res.status(400).json({ message: 'Event ID is required' });

        const existing = await registrationModel.findOne(eventId, req.user.email);
        if (existing) return res.status(400).json({ message: 'Already registered' });

        await registrationModel.create(eventId, req.user.email);
        res.status(201).json({ message: 'Registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration' });
    }
};

const getMine = async (req, res) => {
    try {
        const regs = await registrationModel.getMine(req.user.email);
        res.status(200).json(regs);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching registrations' });
    }
};

const getForEvent = async (req, res) => {
    try {
        const regs = await registrationModel.getForEvent(req.params.id);
        res.status(200).json(regs);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching event registrations' });
    }
};

const cancel = async (req, res) => {
    try {
        await registrationModel.cancel(req.params.eventId, req.user.email);
        res.status(200).json({ message: 'Registration cancelled.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error cancelling registration' });
    }
};

module.exports = { register, getMine, getForEvent, cancel };