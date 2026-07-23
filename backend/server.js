require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const eventRoutes = require('./routes/eventRoutes')
const aiRoutes = require('./routes/aiRoutes')
const registrationRoutes = require('./routes/registrationRoutes')
const feedbackRoutes = require('./routes/feedbackRoutes')
const db = require('./config/database')
const adminRoutes = require('./routes/adminRoutes')

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
app.use('/api', adminRoutes)

app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`)
})