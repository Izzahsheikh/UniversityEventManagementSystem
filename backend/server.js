const express = require('express');
const cors = require('cors');
require('./config/database');
const authRoutes = require('./routes/authRoutes');
const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());

app.use('/api', authRoutes );

app.listen(port, () => {
    console.log(`Backend is up and running on http://localhost:${port}`);
});
