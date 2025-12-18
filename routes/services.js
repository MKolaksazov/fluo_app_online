// services/dataService.js
const db = require('../db');

async function getAllData() {
//  const result = await db.query('SELECT * FROM data_storage ORDER BY id ASC');
  const result = await db.query('SELECT DISTINCT ON (filename) id, filename, created_at FROM data_storage ORDER BY filename, created_at ASC;');
  return result.rows;
}

async function getDataById(id) {
//  const result = await db.query('SELECT json_data FROM data_storage WHERE id = $1', [id]);
  const res = await db.query('SELECT filename FROM data_storage WHERE id = $1;', [id]);
  const result = await db.query('SELECT json_data FROM data_storage WHERE filename = $1 ORDER BY created_at ASC;', [res.rows[0].filename]);

  const allRows = [];
  result.rows.forEach(r => {
      const parsed = JSON.parse(r.json_data); // едномерен масив на ред
      allRows.push(parsed); // добавяме като отделен ред
  });
  return allRows; // вече е двумерен масив
}

async function insertData(jsonData, filename) {
  const result = await db.query(
    'INSERT INTO data_storage (json_data, filename, created_at) VALUES ($1, $2, NOW()) RETURNING id',
    [JSON.stringify(jsonData), filename]
  );
  return result.rows[0];
}

async function deleteData(id) {
  await db.query('DELETE FROM data_storage WHERE id = $1', [id]);
}

module.exports = { getAllData, getDataById, insertData, deleteData };
