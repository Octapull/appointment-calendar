const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Ara Katmanlar (Middleware)
app.use(cors());         // Frontend'in Backend'e erişmesine izin ver
app.use(express.json()); // Gelen veriyi JSON olarak oku

// Rotalar
app.use('/api/auth', authRoutes);

// Basit bir test rotası
app.get('/', (req, res) => {
  res.send('Backend Çalışıyor! 🚀');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});