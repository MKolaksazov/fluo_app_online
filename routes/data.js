const express = require('express');
const router = express.Router();
const { getAllData, getDataById, insertData, deleteData } = require('./services');
const { Parser } = require('json2csv');
const csv = require('csv-parser');
const { Readable } = require('stream');

// GET all data
router.get('/', async (req, res) => {
  try {
    const rows = await getAllData();
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

    const jsonData = JSON.parse(row.json_data);
    const parser = new Parser({ delimiter: '\t' });
    const csvData = parser.parse(jsonData);

    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.send(csvData);
  } catch (err) {
    console.error('Error generating CSV:', err);
    res.status(500).send('Error generating CSV');
  }
});

// POST upload CSV
router.post('/upload-csv', async (req, res) => {
  const csvText = req.body.csvText;
  const fileName = req.body.csvName || 'uploaded_data.csv';

  if (!csvText) return res.status(400).json({ status: 'error', message: 'CSV text is missing' });

  const jsonResults = [];
  const stream = Readable.from(csvText);

  try {
    await new Promise((resolve, reject) => {
      stream.pipe(csv({ separator: '\t', quote: '' }))
        .on('data', (data) => jsonResults.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    const inserted = await insertData(jsonResults, fileName);
    res.json({ status: 'ok', id: inserted.id, rows: jsonResults.length });
  } catch (err) {
    console.error('CSV parsing/DB error:', err);
    res.status(500).json({ status: 'error', message: 'Error processing data.' });
  }
});

// DELETE by ID
router.delete('/:id', async (req, res) => {
  try {
    await deleteData(req.params.id);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).json({ status: 'error', message: 'Delete failed.' });
  }
});

module.exports = router;

