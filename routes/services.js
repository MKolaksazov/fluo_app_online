// services/dataService.js
const db = require('../db');

async function getAllData() {
  const result = await db.query('SELECT * FROM data_storage ORDER BY id ASC');
  return result.rows;
}

async function getDataById(id) {
  const result = await db.query('SELECT json_data FROM data_storage WHERE id = $1', [id]);
  return result.rows[0];
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

