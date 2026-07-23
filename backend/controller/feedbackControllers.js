const feedbackModel = require('../models/feedbackModels.js');

const submitFeedback = async (req, res) => {
    try {
        const { eventId, rating, review, suggestion } = req.body;
        if (!eventId || !rating || !review) {
            return res.status(400).json({ message: 'Event, rating and review are required' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        await feedbackModel.create(eventId, req.user.email, rating, review, suggestion);
        res.status(201).json({ message: 'Feedback submitted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error submitting feedback' });
    }
};

const getAllFeedback = async (req, res) => {
    try {
        const feedback = await feedbackModel.getAll();
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching feedback' });
    }
};

const getMyFeedback = async (req, res) => {
    try {
        const feedback = await feedbackModel.getMine(req.user.email);
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching your feedback' });
    }
};

module.exports = { submitFeedback, getAllFeedback, getMyFeedback };