const express = require('express');
const router = express.Router();
const { getAllData, getDataById, insertData, deleteData } = require('./services');
const { Parser } = require('json2csv');
const csv = require('csv-parser');
const { Readable } = require('stream');

function transpose(arrayData) { return arrayData[0].map((_, colIndex) => arrayData.map(row => row[colIndex])); }

const authenticateJWT = require('../middleware/authenticateJWT');
const authorizeRoles = require('../middleware/authorizeRoles');

// GET all data
router.get('/', authenticateJWT, authorizeRoles(['ADMIN', 'SUPERUSER', 'USER', 'GUEST']), async (req, res) => {
  try {
    const userId = req.user.role === 'GUEST' ? null : req.user.id; // req.body.user ?? 
    const rows = await getAllData(userId);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// GET CSV by ID
router.get('/:id/csv', async (req, res) => {
  try {
    const row = await getDataById(req.params.id);
    if (!row) return res.status(404).send('Record not found');
    const jsonDataTransposed = transpose(row);
    var times = 5; while(times--) { jsonDataTransposed.unshift([ " " ]); }
    const parser = new Parser({ header: false, delimiter: '\t' });
    const csvData = parser.parse(jsonDataTransposed);
    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.send(csvData);
  } catch (err) {
    console.error('Error generating CSV:', err);
    res.status(500).send('Error generating CSV');
  }
});

// POST upload CSV
router.post('/upload-csv', authenticateJWT, authorizeRoles(['ADMIN', 'SUPERUSER', 'USER']), async (req, res) => {
  try {
//console.log('upload successful!');
  const rows = req.body.csvText;
  const filename = req.body.csvName || 'uploaded_data.csv';
  const userId = req.user.role === 'GUEST' ? null : req.user.id; // req.body.user ?? 
  //if (!csvText) return res.status(400).json({ status: 'error', message: 'CSV text is missing' });
  if (!Array.isArray(rows)) {
    return res.status(400).json({ error: "Invalid format" });
  }
  for (let i = 0; i < rows.length; i += 1) {
    await insertData(rows[i], filename, userId);
  }
    res.json({ status: 'ok', id: filename, rows: rows.length });
  } catch (err) {
    console.error('CSV parsing/DB error:', err);
    res.status(500).json({ status: 'error', message: 'Error processing data.' });
  }
});

// DELETE by ID
router.delete('/:id/csv', authenticateJWT, authorizeRoles(['ADMIN', 'SUPERUSER', 'USER']), async (req, res) => {
  try {
    await deleteData(req.params.id);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).json({ status: 'error', message: 'Delete failed.' });
  }
});

module.exports = router;

