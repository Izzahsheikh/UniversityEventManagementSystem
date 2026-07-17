const express = require('express');
const router = express.Router();
const db = require('../config/database');

const createTable = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS Feedback (
            id INT AUTO_INCREMENT PRIMARY KEY,
            eventId INT NOT NULL,
            userEmail VARCHAR(255) NOT NULL,
            rating INT NOT NULL,
            review TEXT NOT NULL,
            suggestion TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
};

// ── SUBMIT FEEDBACK ──
router.post('/feedback', async (req, res) => {
    try {
        await createTable();
        const { eventId, rating, review, suggestion } = req.body;
        const userEmail = req.headers['x-user-email'] || '';

        if (!eventId || !rating || !review) {
            return res.status(400).json({ message: 'Event, rating and review are required' });
        }

        await db.execute(
            'INSERT INTO Feedback (eventId, userEmail, rating, review, suggestion) VALUES (?, ?, ?, ?, ?)',
            [eventId, userEmail, rating, review, suggestion || '']
        );
        res.status(201).json({ message: 'Feedback submitted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error submitting feedback' });
    }
});

// ── GET ALL FEEDBACK ──
router.get('/feedback', async (req, res) => {
    try {
        await createTable();
        const [feedback] = await db.execute('SELECT * FROM Feedback ORDER BY createdAt DESC');
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching feedback' });
    }
});

// ── GET MY FEEDBACK ──
router.get('/feedback/mine', async (req, res) => {
    try {
        await createTable();
        const userEmail = req.headers['x-user-email'] || '';
        const [feedback] = await db.execute(
            'SELECT * FROM Feedback WHERE userEmail = ?',
            [userEmail]
        );
        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching your feedback' });
    }
});

module.exports = router;