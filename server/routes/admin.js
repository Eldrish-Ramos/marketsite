const express = require('express');
const router = express.Router();
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// Store secret in env or secure storage in production!
const AdminUser = require('../models/AdminUser');
const bcrypt = require('bcryptjs');

// For demo: expose QR code for initial setup (remove in production)
router.get('/setup-2fa', async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'Username required' });
  const user = await AdminUser.findOne({ username });
  if (!user) return res.status(404).json({ error: 'User not found' });
  const otpauth = speakeasy.otpauthURL({
    secret: user.totpSecret,
    label: `marketsite-admin`,
    issuer: 'marketsite',
    encoding: 'base32',
  });
  qrcode.toDataURL(otpauth, (err, data_url) => {
    if (err) return res.status(500).json({error: 'QR error'});
    res.json({ qr: data_url, secret: user.totpSecret });
  });
});

// Step 1: Username/password
router.post('/login', async (req, res) => {
  const { username, password, token } = req.body;
  console.log('Login attempt:', { username, password, token });
  const user = await AdminUser.findOne({ username });
  if (!user) {
    console.log('No user found for username:', username);
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const match = await user.comparePassword(password);
  console.log('Password match:', match);
  if (!match) {
    console.log('Password mismatch for user:', username);
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  // Check TOTP code
  const verified = require('speakeasy').totp.verify({
    secret: user.totpSecret,
    encoding: 'base32',
    token,
    window: 1,
  });
  console.log('2FA verified:', verified);
  if (!verified) {
    console.log('2FA code invalid for user:', username);
    return res.status(401).json({ error: 'Invalid credentials or 2FA code' });
  }
  console.log('Login success for user:', username);
  res.json({ success: true });
});

// Step 2: 2FA code
router.post('/verify-2fa', async (req, res) => {
  const { username, token } = req.body;
  const user = await AdminUser.findOne({ username });
  if (!user) return res.status(401).json({ error: 'Invalid 2FA code' });
  const verified = speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: 'base32',
    token,
    window: 1,
  });
  if (!verified) return res.status(401).json({ error: 'Invalid 2FA code' });
  // TODO: Set session/cookie/JWT for admin
  res.json({ success: true });
});

module.exports = router;
