const db = require('../config/database');

const ensureTable = () => db.query(`
    CREATE TABLE IF NOT EXISTS Events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        category VARCHAR(100) NOT NULL,
        venue VARCHAR(255) NOT NULL,
        capacity INT NULL,
        description TEXT NOT NULL,
        status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
        organizerEmail VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`);

const createEvent = async (data, organizerEmail) => {
    await ensureTable();
    const { title, date, category, venue, capacity, description } = data;
    await db.execute(
        `INSERT INTO Events (title, date, category, venue, capacity, description, status, organizerEmail)
         VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
        [title, date, category, venue, capacity || null, description, organizerEmail]
    );
};

const getAllEvents = async () => {
    await ensureTable();
    const [rows] = await db.execute("SELECT * FROM Events WHERE status = 'approved' ORDER BY date ASC");
    return rows;
};

const getAllEventsForAdmin = async () => {
    await ensureTable();
    const [rows] = await db.execute('SELECT * FROM Events ORDER BY date ASC');
    return rows;
};

const getPendingEvents = async () => {
    await ensureTable();
    const [rows] = await db.execute("SELECT * FROM Events WHERE status = 'pending' ORDER BY date ASC");
    return rows;
};

const getEventsByOrganizer = async (organizerEmail) => {
    await ensureTable();
    const [rows] = await db.execute('SELECT * FROM Events WHERE organizerEmail = ? ORDER BY date ASC', [organizerEmail]);
    return rows;
};

const updateEvent = async (id, data) => {
    await ensureTable();
    const { title, date, category, venue, capacity, description } = data;
    const [result] = await db.execute(
        `UPDATE Events SET title=?, date=?, category=?, venue=?, capacity=?, description=? WHERE id=?`,
        [title, date, category, venue, capacity || null, description, id]
    );
    return result.affectedRows;
};

const deleteEvent = async (id) => {
    await ensureTable();
    const [result] = await db.execute('DELETE FROM Events WHERE id = ?', [id]);
    return result.affectedRows;
};

const setStatus = async (id, status) => {
    await ensureTable();
    const [result] = await db.execute('UPDATE Events SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows;
};

const findById = async (id) => {
    await ensureTable();
    const [rows] = await db.execute('SELECT * FROM Events WHERE id = ?', [id]);
    return rows[0] || null;
};

module.exports = {
    ensureTable, createEvent, getAllEvents, getAllEventsForAdmin,
    getPendingEvents, getEventsByOrganizer, updateEvent, deleteEvent, setStatus, findById
};