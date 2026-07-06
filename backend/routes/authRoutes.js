const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ── REGISTRATION ENDPOINT ──
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        // Auto-create table if it doesn't exist
        await db.query(`
            CREATE TABLE IF NOT EXISTS Users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fullName VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                role ENUM('student', 'organizer', 'admin', 'teacher') NOT NULL,
                password VARCHAR(255) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are Required' });
        }

        const checkUserQuery = 'SELECT * from Users WHERE email = ?';
        const [existingUsers] = await db.execute(checkUserQuery, [email]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already Registered' });
        }

        const insertUserQuery = 'INSERT INTO Users (fullName, email, role, password) VALUES (?, ?, ?, ?)';
        await db.execute(insertUserQuery, [fullName, email, role, password]);

        res.status(201).json({
            message: 'Registration Successful',
            user: { fullName, email, role }
        });

    } catch (error) {
        console.error("Database Operation Failure:", error);
        res.status(500).json({ message: 'Server error during Registration' });        
    }
});

// ── LOGIN ENDPOINT ──
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Search for user matching the provided email
        const [users] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);

        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        // Direct plain-text password match check to match your signup logic
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Return token and data matching your React App.jsx structural needs
        res.status(200).json({
            message: 'Login successful',
            token: 'dummy-jwt-token-for-now',
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Failure:", error);
        res.status(500).json({ message: 'Server error during Login' });
    }
});

module.exports = router;