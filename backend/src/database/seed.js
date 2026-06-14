// src/database/seed.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const fs    = require('fs');
const path  = require('path');
const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST, port: process.env.DB_PORT,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, multipleStatements: true,
  });
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    console.log('⏳  Memasukkan sample data ...');
    await conn.query(sql);
    console.log('✅  Seed data berhasil dimasukkan');
  } catch (err) {
    console.error('❌  Error seed:', err.message);
  } finally { await conn.end(); }
}
run();
