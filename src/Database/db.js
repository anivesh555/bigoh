
const { Pool } = require('pg');
const constants = require("../utilities/constants");

const pool = new Pool({
  user: process.env.USER || 'postgres',
  host: process.env.HOST ||  'localhost',
  database: process.env.DATABASE ||  'indigo',
  password: process.env.PASSWORD || '123',
  port: process.env.DB_PORT || 8100,
});

pool.on('error', (err) => {
  console.error('Error connecting to the database:', err);
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

module.exports = pool;
