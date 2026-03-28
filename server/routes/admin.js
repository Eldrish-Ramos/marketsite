const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const router = express.Router();

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});

const failedAttemptsByIp = new Map();
const maxAttempts = Number.parseInt(process.env.ADMIN_LOGIN_MAX_ATTEMPTS || '5', 10);
const lockoutMinutes = Number.parseInt(process.env.ADMIN_LOGIN_LOCKOUT_MINUTES || '15', 10);
const lockoutMs = lockoutMinutes * 60 * 1000;

function constantTimeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) {
    return false;
  }
  return crypto.timingSafeEqual(left, right);
}

function getClientRecord(ip) {
  const existing = failedAttemptsByIp.get(ip);
  if (!existing) {
    return { failures: 0, lockedUntil: 0 };
  }
  if (existing.lockedUntil && existing.lockedUntil <= Date.now()) {
    failedAttemptsByIp.delete(ip);
    return { failures: 0, lockedUntil: 0 };
  }
  return existing;
}

function registerFailedAttempt(ip) {
  const current = getClientRecord(ip);
  const failures = current.failures + 1;
  const lockedUntil = failures >= maxAttempts ? Date.now() + lockoutMs : 0;
  failedAttemptsByIp.set(ip, { failures, lockedUntil });
  return { failures, lockedUntil };
}

function clearAttempts(ip) {
  failedAttemptsByIp.delete(ip);
}

// POST /api/admin/login - Admin login with lockout and JWT issuance
router.post('/login', adminLoginLimiter, (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const configuredPin = String(process.env.ADMIN_PIN || '').trim();
  const jwtSecret = String(process.env.ADMIN_JWT_SECRET || '').trim();

  if (!configuredPin || !jwtSecret) {
    return res.status(500).json({ error: 'Admin auth is not configured.' });
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const record = getClientRecord(ip);
  if (record.lockedUntil && record.lockedUntil > Date.now()) {
    const secondsLeft = Math.ceil((record.lockedUntil - Date.now()) / 1000);
    return res.status(429).json({ error: `Too many failed attempts. Try again in ${secondsLeft}s.` });
  }

  if (!constantTimeEqual(pin, configuredPin)) {
    registerFailedAttempt(ip);
    return res.status(401).json({ error: 'Invalid pin' });
  }

  clearAttempts(ip);

  const token = jwt.sign(
    { role: 'admin' },
    jwtSecret,
    {
      subject: 'admin',
      expiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '8h',
      issuer: 'marketsite',
    }
  );

  return res.json({ success: true, token });
});

module.exports = router;
