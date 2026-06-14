// src/database/schema.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const fs    = require('fs');
const path  = require('path');
const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST, port: process.env.DB_PORT,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    console.log('⏳  Menjalankan schema.sql ...');
    await conn.query(sql);
    console.log('✅  Schema berhasil dibuat');
  } catch (err) {
    console.error('❌  Error schema:', err.message);
  } finally { await conn.end(); }
}
run();
