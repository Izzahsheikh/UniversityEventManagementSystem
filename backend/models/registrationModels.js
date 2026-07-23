const db = require('../config/database');

const ensureTable = () => db.query(`
    CREATE TABLE IF NOT EXISTS Registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        eventId INT NOT NULL,
        userEmail VARCHAR(255) NOT NULL,
        registeredAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`);

const findOne = async (eventId, userEmail) => {
    await ensureTable();
    const [rows] = await db.execute('SELECT * FROM Registrations WHERE eventId = ? AND userEmail = ?', [eventId, userEmail]);
    return rows[0] || null;
};

const create = async (eventId, userEmail) => {
    await ensureTable();
    await db.execute('INSERT INTO Registrations (eventId, userEmail) VALUES (?, ?)', [eventId, userEmail]);
};

const getMine = async (userEmail) => {
    await ensureTable();
    const [rows] = await db.execute('SELECT * FROM Registrations WHERE userEmail = ?', [userEmail]);
    return rows;
};

const getForEvent = async (eventId) => {
    await ensureTable();
    const [rows] = await db.execute('SELECT * FROM Registrations WHERE eventId = ?', [eventId]);
    return rows;
};

const cancel = async (eventId, userEmail) => {
    await ensureTable();
    await db.execute('DELETE FROM Registrations WHERE eventId = ? AND userEmail = ?', [eventId, userEmail]);
};

module.exports = { ensureTable, findOne, create, getMine, getForEvent, cancel };