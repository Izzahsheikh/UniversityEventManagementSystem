const { Connection } = require('mysql2')
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'ABDULkareem123',
    database:'eventManagementSystem',
    waitForConnections:'true',
    connectionLimit:10,
    queueLimit:0
})

module.exports = pool;