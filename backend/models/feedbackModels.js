const db = require('../config/database');

const ensureTable = () => db.query(`
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

const create = async (eventId, userEmail, rating, review, suggestion) => {
    await ensureTable();
    await db.execute(
        'INSERT INTO Feedback (eventId, userEmail, rating, review, suggestion) VALUES (?, ?, ?, ?, ?)',
        [eventId, userEmail, rating, review, suggestion || '']
    );
};

const getAll = async () => {
    await ensureTable();
    const [rows] = await db.execute('SELECT * FROM Feedback ORDER BY createdAt DESC');
    return rows;
};

const getMine = async (userEmail) => {
    await ensureTable();
    const [rows] = await db.execute('SELECT * FROM Feedback WHERE userEmail = ?', [userEmail]);
    return rows;
};

module.exports = { ensureTable, create, getAll, getMine };