const express = require('express');
const router = express.Router();
const ROLES = require('../roles');
const { hashPassword, comparePassword, generateToken } = require('../auth.utils');
const db = require('../db');

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const password_hash = await hashPassword(password);

    const result = await db.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, role`,
      [username, email, password_hash, ROLES.USER]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'User already exists or DB error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query(
      `SELECT id, username, password_hash, role
       FROM users
       WHERE username = $1`,
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const ok = await comparePassword(password, user.password_hash);

    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });

  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});


module.exports = router;
