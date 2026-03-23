const express = require('express');
const router = express.Router();

// POST /api/admin/login - Admin login with PIN
router.post('/login', (req, res) => {
  const { pin } = req.body;
  const configuredPin = process.env.ADMIN_PIN;
  if (!configuredPin) {
    return res.status(500).json({ error: 'Admin PIN not configured' });
  }
  if (pin === configuredPin) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ error: 'Invalid pin' });
  }
});

module.exports = router;
