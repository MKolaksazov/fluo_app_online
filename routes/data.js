const express = require('express');
const router = express.Router();
const db = require('../db');
const { Parser } = require('json2csv');

router.get('/:id/csv', async (req, res) => {
  try {
    const result = await db.query('SELECT json_data FROM data_storage WHERE id = $1', [req.params.id]);
//  const [rows] = await db.query('SELECT json_data FROM data_storage WHERE id = ?', [req.params.id]);

    if (result.length === 0) return res.status(404).send('Record not found');

    const jsonData = JSON.parse(result.rows[0].json_data);

    const parser = new Parser({ delimiter: '\t' }); // табулация като разделител
    const csv = parser.parse(jsonData);

    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating CSV');
  }
});

module.exports = router;

