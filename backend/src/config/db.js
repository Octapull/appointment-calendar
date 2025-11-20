const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,   
});

// Bağlantıyı test edelim
pool.connect((err) => {
  if (err) {
    console.error('Veritabanı bağlantı hatası:', err.stack);
  } else {
    console.log('PostgreSQL veritabanına başarıyla bağlandı!');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};