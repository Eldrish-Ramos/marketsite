const admin = require('firebase-admin');

function loadServiceAccountFromEnv() {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const base64Json = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

  if (!rawJson && !base64Json) {
    throw new Error('Firebase admin credentials are not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_BASE64.');
  }

  const source = rawJson || Buffer.from(base64Json, 'base64').toString('utf8');

  try {
    const parsed = JSON.parse(source);
    if (typeof parsed.private_key === 'string') {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    return parsed;
  } catch {
    throw new Error('Invalid Firebase service account JSON in environment variables.');
  }
}

if (!admin.apps.length) {
  const explicitPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (explicitPath) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = explicitPath;
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.cert(loadServiceAccountFromEnv()),
    });
  }
}

const db = admin.firestore();

module.exports = { admin, db };