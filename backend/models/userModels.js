const db = require('../config/database');

const ensureTable = () => db.query(`
    CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        role ENUM('student', 'organizer', 'admin') NOT NULL,
        password VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`);

const findByEmail = async (email) => {
    await ensureTable();
    const [rows] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
    return rows[0] || null;
};

const createUser = async (fullName, email, hashedPassword, role) => {
    await ensureTable();
    await db.execute(
        'INSERT INTO Users (fullName, email, role, password) VALUES (?, ?, ?, ?)',
        [fullName, email, role, hashedPassword]
    );
};

const getAllUsers = async () => {
    await ensureTable();
    const [rows] = await db.execute('SELECT id, fullName, email, role, createdAt FROM Users');
    return rows;
};

const deleteUser = async (id) => {
    await ensureTable();
    const [result] = await db.execute('DELETE FROM Users WHERE id = ?', [id]);
    return result.affectedRows;
};

module.exports = { ensureTable, findByEmail, createUser, getAllUsers, deleteUser };