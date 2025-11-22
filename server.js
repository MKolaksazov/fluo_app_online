const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const csv = require('csv-parser');
const db = require('./db');
//const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3030;
app.use(express.static('public'));
app.use(express.json());
/*
const db = mysql.createConnection({
  host: 'localhost',
  user: 'appuser',
  password: 'StrongPassword123!',
  database: 'csv_tool_db'
});
*/
//const uploadRoutes = require('./routes/upload');
//app.use('/api', uploadRoutes);

const dataRoutes = require('./routes/data');
app.use('/api/data', dataRoutes);

const uploadRoutes = require('./routes/upload-csv');
app.use('/api', uploadRoutes);

db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

app.use((req, res, next) => {
  console.log('🔹 Incoming request:', req.method, req.url);
  next();
});

// Serve static files
//app.use(express.json());

// API routes за CSV обработка
// === 2. Настройка за временно съхранение на качени CSV файлове ===

const upload = multer({ dest: 'uploads/' });

// CSV upload логика
app.post('/api/upload-csv', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Не е качен файл' });
  res.json({ message: 'Файлът е качен успешно ✅', filename: req.file.filename });
});

// CSV processing логика

app.get('/api/process-csv', (req, res) => {
  const filename = req.query.filename;
  if (!filename) return res.status(400).json({ error: 'Липсва параметър filename' });

  const filepath = path.join(__dirname, 'uploads', filename);
  const results = [];

  fs.createReadStream(filepath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json({ rows: results.length, data: results.slice(0, 50) }); // до 50 реда за тест
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).json({ error: 'Грешка при четене на CSV файла' });
    });
});

// === 4. Примерен API маршрут за тестване ===
app.get('/api/status', (req, res) => {
res.json({ status: 'Сървърът работи успешно ✅', time: new Date().toLocaleString() });
});


app.get('/api/data', (req, res) => {
//  const result = await pool.query("SELECT * FROM data_storage");
//  return result.rows;


  db.query('SELECT * FROM data_storage', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query failed' });
    } else {
      res.json(results);
    }
  });
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
