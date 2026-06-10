// src/database/schema.js
// Runner untuk eksekusi schema.sql ke MySQL

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const fs   = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function runSchema() {
  const connection = await mysql.createConnection({
    host    : process.env.DB_HOST,
    port    : process.env.DB_PORT,
    user    : process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });

  try {
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    console.log('⏳  Menjalankan schema.sql ...');
    await connection.query(sql);
    console.log('✅  Schema berhasil dibuat: retailview_dw');
  } catch (err) {
    console.error('❌  Error saat menjalankan schema:', err.message);
  } finally {
    await connection.end();
  }
}

runSchema();
