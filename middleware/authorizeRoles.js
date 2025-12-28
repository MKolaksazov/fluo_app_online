function authorizeRoles(allowed) {
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {console.log('authorizeRoles error');
      return res.status(403).json({ error: 'Forbidden' });
    } console.log('recognized!');
    next();
  };
}

module.exports = authorizeRoles;
