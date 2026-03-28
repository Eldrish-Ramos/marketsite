const express = require('express');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const { parsePhoneNumber } = require('libphonenumber-js');

const router = express.Router();

const emailPattern = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many contact requests. Please try again later.' },
});

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const requireEnv = (name) => {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
};

const createTransporter = () => {
  const host = requireEnv('CONTACT_SMTP_HOST');
  const port = Number.parseInt(requireEnv('CONTACT_SMTP_PORT') || '587', 10);
  const user = requireEnv('CONTACT_SMTP_USER');
  const pass = requireEnv('CONTACT_SMTP_PASS');
  const secureSetting = requireEnv('CONTACT_SMTP_SECURE');
  const secure = secureSetting ? secureSetting === 'true' : port === 465;

  if (!host || !port || !user || !pass) {
    throw new Error('Contact email service is not fully configured.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
};

router.post('/', contactLimiter, async (req, res) => {
  const name = String(req.body.name || '').trim();
  const phone = String(req.body.phone || '').trim();
  const email = String(req.body.email || '').trim();
  const message = String(req.body.message || '').trim();
  const itemTitle = String(req.body.itemTitle || '').trim();
  const itemId = String(req.body.itemId || '').trim();

  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'Name, phone, and email are required.' });
  }

  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // Validate phone number using libphonenumber-js (default to US if no country code)
  let phoneNumber;
  try {
    phoneNumber = parsePhoneNumber(phone, 'US');
    if (!phoneNumber || !phoneNumber.isValid()) {
      return res.status(400).json({ error: 'Please enter a valid phone number.' });
    }
  } catch {
    return res.status(400).json({ error: 'Please enter a valid phone number.' });
  }

  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message must be 2000 characters or fewer.' });
  }

  const recipient = requireEnv('CONTACT_EMAIL_TO') || 'eldrishsells@gmail.com';
  const sender = requireEnv('CONTACT_EMAIL_FROM') || requireEnv('CONTACT_SMTP_USER');

  if (!sender) {
    return res.status(500).json({ error: 'Contact sender email is not configured.' });
  }

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: sender,
      to: recipient,
      replyTo: email,
      subject: `New listing inquiry${itemTitle ? `: ${itemTitle}` : ''}`,
      text: [
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        itemTitle ? `Item: ${itemTitle}` : null,
        itemId ? `Item ID: ${itemId}` : null,
        '',
        'Message:',
        message || '(No message provided)',
      ].filter(Boolean).join('\n'),
      html: `
        <h2>New listing inquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${itemTitle ? `<p><strong>Item:</strong> ${escapeHtml(itemTitle)}</p>` : ''}
        ${itemId ? `<p><strong>Item ID:</strong> ${escapeHtml(itemId)}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message || '(No message provided)').replace(/\n/g, '<br />')}</p>
      `,
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('Contact email send failed:', error);
    return res.status(500).json({ error: 'Unable to send your message right now.' });
  }
});

module.exports = router;