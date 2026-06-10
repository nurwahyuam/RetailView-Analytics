// src/database/seed.js
// Runner untuk insert sample data ke dalam database

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const fs    = require('fs');
const path  = require('path');
const mysql = require('mysql2/promise');

async function runSeed() {
  const connection = await mysql.createConnection({
    host    : process.env.DB_HOST,
    port    : process.env.DB_PORT,
    user    : process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  try {
    const sql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    console.log('⏳  Memasukkan sample data ...');
    await connection.query(sql);
    console.log('✅  Seed data berhasil dimasukkan');
  } catch (err) {
    console.error('❌  Error saat seed:', err.message);
  } finally {
    await connection.end();
  }
}

runSeed();
