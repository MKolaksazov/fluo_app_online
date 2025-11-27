const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.static('public'));
app.use(express.json());

// Главни API маршрути
const dataRoutes = require('./routes/data');
app.use('/api/data', dataRoutes);

// Лог за всички заявки (добра практика)
app.use((req, res, next) => {
  console.log(`🔹 ${req.method} ${req.url}`);
  next();
});

// Проверка на DB
db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

// Статус
app.get('/api/status', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

// Стартиране на сървъра
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

