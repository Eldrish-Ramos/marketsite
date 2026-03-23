const express = require('express');
const router = express.Router();
const multer = require('multer');
const { randomUUID } = require('crypto');
const fs = require('fs');
const path = require('path');
const { db, bucket } = require('../firebase');

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/items/upload - Upload image and title
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { title } = req.body;
    if (!req.file || !title) {
      return res.status(400).json({ error: 'Image and title are required' });
    }
    // Upload image to Firebase Storage
    const fileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`;
    let imageUrl;

    try {
      const file = bucket.file(`items/${fileName}`);
      const downloadToken = randomUUID();
      await file.save(req.file.buffer, {
        metadata: {
          contentType: req.file.mimetype,
          metadata: {
            firebaseStorageDownloadTokens: downloadToken,
          },
        },
      });
      const encodedFilePath = encodeURIComponent(file.name);
      imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedFilePath}?alt=media&token=${downloadToken}`;
    } catch (storageErr) {
      const uploadDir = path.join(__dirname, '..', 'uploads', 'items');
      await fs.promises.mkdir(uploadDir, { recursive: true });
      const localPath = path.join(uploadDir, fileName);
      await fs.promises.writeFile(localPath, req.file.buffer);
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      imageUrl = `${baseUrl}/uploads/items/${encodeURIComponent(fileName)}`;
      console.warn('Firebase upload failed, using local upload fallback:', storageErr.message);
    }

    // Save item to Firestore
    const docRef = await db.collection('items').add({
      title,
      imageUrl,
      createdAt: new Date()
    });
    res.json({ id: docRef.id, title, imageUrl });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({
      error: 'Failed to upload item',
      details: process.env.NODE_ENV === 'production' ? undefined : err.message,
    });
  }
});

// GET /api/items - Get all items
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('items').orderBy('createdAt', 'desc').get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

module.exports = router;
