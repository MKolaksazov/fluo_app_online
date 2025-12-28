const express = require('express');
const path = require('path');
const db = require('./db');
const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.json({ limit: '5mb' }));

// Всички пътища без токен и role пренасочват към login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.use(express.static('public'));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Главни API маршрути
const dataRoutes = require('./routes/data');
app.use('/api/data', dataRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

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
    console.log('✅ Connected to the database');
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

