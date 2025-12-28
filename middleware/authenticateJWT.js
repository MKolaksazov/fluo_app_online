const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
  console.log('🔐 Received header:', req.headers.authorization);
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = { role: 'GUEST' };
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log('✅ Token decoded:', decoded); 
    req.user = decoded;
  } catch {
    req.user = { role: 'GUEST' };
  }

  next();
}

module.exports = authenticateJWT;
