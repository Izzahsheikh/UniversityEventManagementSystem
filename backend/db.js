const mysql = require('mysql2'); 

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ABDULkareem123',
  database: 'eventManagementSystem',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
});

connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
  if (err) throw err;
  console.log("Successfully Connected to DataBase");
});

connection.end();