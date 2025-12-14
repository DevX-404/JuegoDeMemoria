import mysql from 'mysql2/promise';

// Configure your real MySQL credentials here
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',      // Your MySQL user (usually root in XAMPP)
    password: '123456',      // Your password (usually empty in XAMPP)
    database: 'arcade_hub',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;