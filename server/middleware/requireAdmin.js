const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!token) {
    return res.status(401).json({ error: 'Admin authentication required.' });
  }

  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'Admin auth is not configured.' });
  }

  try {
    const payload = jwt.verify(token, secret);
    if (payload.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access denied.' });
    }

    req.admin = { id: payload.sub };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired admin token.' });
  }
}

module.exports = requireAdmin;