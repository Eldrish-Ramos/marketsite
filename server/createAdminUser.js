require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const AdminUser = require('./models/AdminUser');

const MONGODB_URI = process.env.MONGODB_URI;

async function createAdminUser() {
  await mongoose.connect(MONGODB_URI);
  const username = 'EldrishRamos';
  const password = 'EldrishRamos123!';
  const totpSecret = speakeasy.generateSecret({ length: 20 }).base32;
  const hash = await bcrypt.hash(password, 10);

  const existing = await AdminUser.findOne({ username });
  if (existing) {
    console.log('Admin user already exists.');
    process.exit(0);
  }

  const user = new AdminUser({ username, password: hash, totpSecret });
  await user.save();
  console.log('Admin user created. TOTP secret:', totpSecret);
  process.exit(0);
}

createAdminUser();
