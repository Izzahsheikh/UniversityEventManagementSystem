const express = require('express');
const router = express.Router();
const db = require('../config/database');

const createTable = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS Registrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            eventId INT NOT NULL,
            userEmail VARCHAR(255) NOT NULL,
            registeredAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
};

// ── REGISTER FOR EVENT ──
router.post('/registrations', async (req, res) => {
    try {
        await createTable();
        const { eventId } = req.body;
        const userEmail = req.headers['x-user-email'] || '';

        if (!eventId) return res.status(400).json({ message: 'Event ID is required' });

        const [existing] = await db.execute(
            'SELECT * FROM Registrations WHERE eventId = ? AND userEmail = ?',
            [eventId, userEmail]
        );
        if (existing.length > 0) return res.status(400).json({ message: 'Already registered' });

        await db.execute(
            'INSERT INTO Registrations (eventId, userEmail) VALUES (?, ?)',
            [eventId, userEmail]
        );
        res.status(201).json({ message: 'Registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// ── GET MY REGISTRATIONS ──
router.get('/registrations/mine', async (req, res) => {
    try {
        await createTable();
        const userEmail = req.headers['x-user-email'] || '';
        const [regs] = await db.execute(
            'SELECT * FROM Registrations WHERE userEmail = ?',
            [userEmail]
        );
        res.status(200).json(regs);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching registrations' });
    }
});

// ── GET REGISTRATIONS FOR AN EVENT ──
router.get('/registrations/event/:id', async (req, res) => {
    try {
        await createTable();
        const [regs] = await db.execute(
            'SELECT * FROM Registrations WHERE eventId = ?',
            [req.params.id]
        );
        res.status(200).json(regs);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching event registrations' });
    }
});

// ── CANCEL REGISTRATION ──
router.delete('/registrations/:eventId', async (req, res) => {
    try {
        await createTable();
        const userEmail = req.headers['x-user-email'] || '';
        await db.execute(
            'DELETE FROM Registrations WHERE eventId = ? AND userEmail = ?',
            [req.params.eventId, userEmail]
        );
        res.status(200).json({ message: 'Registration cancelled.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error cancelling registration' });
    }
});

module.exports = router;