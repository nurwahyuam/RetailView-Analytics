require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "retailview_dw",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+07:00",
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`✅  Database terhubung: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
    connection.release();
  } catch (err) {
    console.error("❌  Koneksi database gagal:", err.message);
    process.exit(1);
  }
}

module.exports = {
  pool,
  testConnection,
};
