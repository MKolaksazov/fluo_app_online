//const mysql = require("mysql2");
const mysql = require('mysql2/promise');
require('dotenv').config(); // ако ползваш .env

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
//  host: 'localhost',
//  user: 'appuser',
//  password: 'StrongPassword123!',
//  database: 'csv_tool_db'
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
