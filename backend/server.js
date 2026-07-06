const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const db = require('./config/database');

const app = express();
const port = 3000;

// Enable CORS and JSON parsing
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Main Route Declarations
app.use('/api', authRoutes);
app.use('/api', eventRoutes);

// ── ADMIN METRICS SUMMARY ENDPOINT ──
app.get('/api/admin/stats', async (req, res) => {
    try {
        const [[{ totalUsers }]] = await db.execute("SELECT COUNT(*) as totalUsers FROM Users");
        const [[{ totalEvents }]] = await db.execute("SELECT COUNT(*) as totalEvents FROM Events");
        const [[{ pendingApprovals }]] = await db.execute("SELECT COUNT(*) as pendingApprovals FROM Events WHERE status = 'pending'");
        const [[{ studentsCount }]] = await db.execute("SELECT COUNT(*) as studentsCount FROM Users WHERE role = 'student'");
        const [[{ organizersCount }]] = await db.execute("SELECT COUNT(*) as organizersCount FROM Users WHERE role = 'organizer'");
        const [[{ feedbackCount }]] = await db.execute("SELECT COUNT(*) as feedbackCount FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Feedback'");

        res.status(200).json({
            totalUsers,
            totalEvents,
            pendingApprovals,
            studentsCount,
            organizersCount,
            feedbackCount: feedbackCount ? 0 : 0
        });
    } catch (error) {
        console.error("Fetch Admin Stats Failure:", error);
        res.status(500).json({ message: 'Server error compiling dashboard metrics' });
    }
});

// ── GET ALL USER DIRECTORIES FOR ADMIN ──
app.get('/api/admin/users', async (req, res) => {
    try {
        const [users] = await db.execute("SELECT id, fullName, email, role, createdAt FROM Users ORDER BY createdAt DESC");
        res.status(200).json(users);
    } catch (error) {
        console.error("Fetch Users Failure:", error);
        res.status(500).json({ message: 'Server error fetching user directories' });
    }
});

// ── GET FEEDBACK DATASET FOR ADMIN ──
app.get('/api/feedback', async (req, res) => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS Feedback (
                id INT AUTO_INCREMENT PRIMARY KEY,
                eventId INT NOT NULL,
                userEmail VARCHAR(255) NOT NULL,
                comments TEXT NOT NULL,
                rating INT NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        const [feedback] = await db.execute("SELECT * FROM Feedback ORDER BY createdAt DESC");
        res.status(200).json(feedback);
    } catch (error) {
        console.error("Fetch Feedback Failure:", error);
        res.status(500).json({ message: 'Server error fetching feedback datasets' });
    }
});

// Temporary safety fallbacks to satisfy frontend mounting hooks
app.get('/api/registrations/mine', (req, res) => res.status(200).json([]));
app.get('/api/feedback/mine', (req, res) => res.status(200).json([]));

app.listen(port, () => {
    console.log(`Backend is up and running on http://localhost:${port}`);
});