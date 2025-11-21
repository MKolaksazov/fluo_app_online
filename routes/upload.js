const express = require('express');
const multer = require('multer');
const csv = require('csvtojson');
const fs = require('fs');
const db = require('../db');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;

    // 1. Конвертираме CSV → JSON
    const jsonArray = await csv({
      delimiter: '\t',
    }).fromFile(filePath);

    // 2. Запис в MySQL
    const jsonString = JSON.stringify(jsonArray);
    
    const [result] = await db.query(
      'INSERT INTO data_storage (json_data, filename, created_at) VALUES (?, ?, NOW())',
      [jsonString, req.file.originalname]
    );

    // 3. Изтриваме временния CSV
    fs.unlinkSync(filePath);

    res.json({ status: 'success', inserted_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
