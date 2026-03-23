const admin = require('firebase-admin');
const path = require('path');

// Path to your service account key
const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.firebasestorage.app`;


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };