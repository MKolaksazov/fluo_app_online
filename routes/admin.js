const express = require('express');
const router = express.Router();

const authenticateJWT = require('../middleware/authenticateJWT');
const authorizeRoles = require('../middleware/authorizeRoles');
const { getAllData, getDataById, insertData, deleteData } = require('./services');
const db = require('../db');

/**
 * ⚠️ ВСИЧКО ТУК Е САМО ЗА ADMIN
 */
router.use(authenticateJWT);
router.use(authorizeRoles(['ADMIN']));

/**
 * =========================
 * USERS
 * =========================
 */

// Всички потребители
router.get('/users', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, username, email, role FROM users ORDER BY id'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot fetch users' });
  }
});

// Създаване на потребител (по избор на админа)
router.post('/users', async (req, res) => {
  const { username, email, password_hash, role } = req.body;

  try {
    await db.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)`,
      [username, email, password_hash, role || 'USER']
    );

    res.json({ message: 'User created' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'User creation failed' });
  }
});

// Промяна на роля
router.put('/users/:id/role', async (req, res) => {
  const { role } = req.body;

  try {
    await db.query(
      'UPDATE users SET role = $1 WHERE id = $2',
      [role, req.params.id]
    );

    res.json({ message: 'Role updated' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Role update failed' });
  }
});

// Изтриване на потребител
router.delete('/users/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'User delete failed' });
  }
});

/**
 * =========================
 * DATA / CSV FILES
 * =========================
 */

// Всички записи (с и без автор)
router.get('/data', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT DISTINCT ON (d.filename) d.id, d.filename, d.created_at, u.username 
      FROM data_storage d 
      LEFT JOIN users u ON u.id = d.user_id 
      ORDER BY d.filename, d.created_at DESC;
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cannot fetch data' });
  }
});

// Изтриване на запис
router.delete('/data/:id', async (req, res) => {
  try {
    await deleteData(req.params.id);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).json({ status: 'error', message: 'Delete failed.' });
  }
});

module.exports = router;
