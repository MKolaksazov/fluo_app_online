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
  try {

  const rows = req.body.csvText;
  const filename = req.body.csvName || 'uploaded_data.csv';

  //if (!csvText) return res.status(400).json({ status: 'error', message: 'CSV text is missing' });

  if (!Array.isArray(rows)) {
    return res.status(400).json({ error: "Invalid format" });
  }

  // Тук правим batch insert (примерно на 500 реда)

        // 1) Първият ред е header
        const header = rows[0];
        const dataRows = rows //.slice(1);

        // 2) Подготовка за batch INSERT
        const batchSize = 200;    // 200 реда за заявка – безопасно
        let inserted = 0;

        for (let i = 0; i < dataRows.length; i += batchSize) {
            const chunk = dataRows.slice(i, i + batchSize);

            // превръщаме chunk в многоредов INSERT
            // таблица: data_storage (filename, json_data)
            // json_data = JSON обект за всеки ред
            const values = [];
            const params = [];

            chunk.forEach((row, idx) => {
                const obj = {};

                // мапваме всяка клетка към ключ от header
                header.forEach((key, colIndex) => {
                    obj[key] = row[colIndex] ?? null;
                });

                params.push(JSON.stringify(obj));
                values.push(`($1, $${params.length + 1})`);
            });

            // filename e $1, json_data e $2...$N
            const sql = `INSERT INTO data_storage (filename, json_data) VALUES ${values.join(",")}`;

            await db.query(sql, [filename, ...params]);
            inserted += chunk.length;
        }



/*

  //await insertInBatches(rows);

//  const jsonResults = [];
//const stream = Readable.from(csvText);

  try {

    await new Promise((resolve, reject) => {
      stream.pipe(csv({ separator: '\t', quote: '' }))
        .on('data', (data) => jsonResults.push(data))
        .on('end', resolve)
        .on('error', reject);
    });
*/
    //const inserted = await insertData(rows, fileName);
    res.json({ status: 'ok', id: inserted, rows: rows.length });
  } catch (err) {
    console.error('CSV parsing/DB error:', err);
    res.status(500).json({ status: 'error', message: 'Error processing data.' });
  }
});

// DELETE by ID
router.delete('/:id/csv', async (req, res) => {
  try {
    await deleteData(req.params.id);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).json({ status: 'error', message: 'Delete failed.' });
  }
});

module.exports = router;

