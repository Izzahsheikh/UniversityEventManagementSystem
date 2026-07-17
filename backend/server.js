require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const eventRoutes = require('./routes/eventRoutes')
const aiRoutes = require('./routes/aiRoutes')
const registrationRoutes = require('./routes/registrationRoutes')
const feedbackRoutes = require('./routes/feedbackRoutes')
const db = require('./config/database')

const app = express()
const port = process.env.PORT || 3000

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

// ── ROUTES ──
app.use('/api', authRoutes)
app.use('/api', eventRoutes)
app.use('/api', aiRoutes)
app.use('/api', registrationRoutes) // ✅ now actually used
app.use('/api', feedbackRoutes)     // ✅ now actually used

// ── ADMIN STATS ──
app.get('/api/admin/stats', async (req, res) => {
    try {
        const [[{ totalUsers }]] = await db.execute("SELECT COUNT(*) as totalUsers FROM Users")
        const [[{ totalEvents }]] = await db.execute("SELECT COUNT(*) as totalEvents FROM Events")
        const [[{ pendingApprovals }]] = await db.execute("SELECT COUNT(*) as pendingApprovals FROM Events WHERE status = 'pending'")
        const [[{ studentsCount }]] = await db.execute("SELECT COUNT(*) as studentsCount FROM Users WHERE role = 'student'")
        const [[{ organizersCount }]] = await db.execute("SELECT COUNT(*) as organizersCount FROM Users WHERE role = 'organizer'")
        const [[{ feedbackCount }]] = await db.execute("SELECT COUNT(*) as feedbackCount FROM Feedback")

        res.status(200).json({ totalUsers, totalEvents, pendingApprovals, studentsCount, organizersCount, feedbackCount })
    } catch (error) {
        console.error("Fetch Admin Stats Failure:", error)
        res.status(500).json({ message: 'Server error compiling dashboard metrics' })
    }
})

// ── ADMIN GET ALL USERS ──
app.get('/api/admin/users', async (req, res) => {
    try {
        const [users] = await db.execute("SELECT id, fullName, email, role, createdAt FROM Users ORDER BY createdAt DESC")
        res.status(200).json(users)
    } catch (error) {
        console.error("Fetch Users Failure:", error)
        res.status(500).json({ message: 'Server error fetching users' })
    }
})

// ── ADMIN DELETE USER ──
app.delete('/api/admin/users/:id', async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM Users WHERE id = ?', [req.params.id])
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' })
        res.status(200).json({ message: 'User deleted successfully.' })
    } catch (error) {
        console.error("Delete User Failure:", error)
        res.status(500).json({ message: 'Server error deleting user' })
    }
})

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`)
})