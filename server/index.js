require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const path = require('path');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const trustProxyRaw = (process.env.TRUST_PROXY || '').trim();
if (trustProxyRaw) {
  if (trustProxyRaw === 'true') {
    app.set('trust proxy', true);
  } else if (trustProxyRaw === 'false') {
    app.set('trust proxy', false);
  } else {
    const parsedProxy = Number.parseInt(trustProxyRaw, 10);
    app.set('trust proxy', Number.isNaN(parsedProxy) ? trustProxyRaw : parsedProxy);
  }
} else {
  app.set('trust proxy', isProduction ? 1 : false);
}

const configuredOrigins = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = configuredOrigins.length > 0
  ? configuredOrigins
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS origin denied'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true, limit: '200kb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();



app.use('/api/items', require('./routes/items'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/contact', require('./routes/contact'));

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
