const express = require('express');
const router = express.Router();
const multer = require('multer');
const { randomUUID } = require('crypto');
const { db } = require('../firebase');
const { uploadBufferToCloudinary, deleteImageFromCloudinary } = require('../cloudinary');

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

const conditionOptions = new Set([
  'Used - Poor',
  'Used - Good',
  'Used - Like New',
  'New',
]);

const categoryPrefixMap = {
  'Video Games': 'VG',
};

function generateCategoryItemId(category) {
  const prefix = categoryPrefixMap[category] || 'IT';
  const digits = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join('');
  return `${prefix}${digits}`;
}

async function createUniqueCategoryItemId(category) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const itemId = generateCategoryItemId(category);
    const existing = await db.collection('items').where('itemId', '==', itemId).limit(1).get();
    if (existing.empty) {
      return itemId;
    }
  }
  throw new Error('Could not generate a unique item ID. Please try again.');
}

function isValidPrice(price) {
  const parsedPrice = Number(price);
  return Number.isFinite(parsedPrice) && parsedPrice >= 0;
}

function parseBooleanField(value) {
  return value === true || value === 'true';
}

function getCloudinaryPublicIdFromUrl(imageUrl) {
  if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.includes('res.cloudinary.com')) {
    return null;
  }

  const uploadMarker = '/image/upload/';
  const markerIndex = imageUrl.indexOf(uploadMarker);
  if (markerIndex === -1) {
    return null;
  }

  let publicPart = imageUrl.slice(markerIndex + uploadMarker.length);
  publicPart = publicPart.split('?')[0];

  const versionMatch = publicPart.match(/v\d+\/(.+)/);
  if (versionMatch) {
    publicPart = versionMatch[1];
  }

  const dotIndex = publicPart.lastIndexOf('.');
  if (dotIndex > -1) {
    publicPart = publicPart.slice(0, dotIndex);
  }

  return publicPart || null;
}

async function deleteCloudinaryImageForItem(itemData) {
  const publicIds = Array.isArray(itemData.cloudinaryPublicIds) && itemData.cloudinaryPublicIds.length > 0
    ? itemData.cloudinaryPublicIds
    : [itemData.cloudinaryPublicId || getCloudinaryPublicIdFromUrl(itemData.imageUrl)].filter(Boolean);

  for (const publicId of publicIds) {
    await deleteImageFromCloudinary(publicId);
  }
}

async function uploadImagesToCloudinary(files) {
  const uploads = files.map((file) =>
    uploadBufferToCloudinary(file.buffer, {
      folder: 'items',
      resource_type: 'image',
      public_id: `${Date.now()}-${randomUUID()}`,
    })
  );

  const uploadResults = await Promise.all(uploads);
  const imageUrls = uploadResults.map((result) => result.secure_url);
  const cloudinaryPublicIds = uploadResults.map((result) => result.public_id);

  return { imageUrls, cloudinaryPublicIds };
}

function normalizeItem(doc) {
  const data = doc.data();
  const imageUrls = Array.isArray(data.imageUrls) && data.imageUrls.length > 0
    ? data.imageUrls
    : data.imageUrl
      ? [data.imageUrl]
      : [];

  const cloudinaryPublicIds = Array.isArray(data.cloudinaryPublicIds) && data.cloudinaryPublicIds.length > 0
    ? data.cloudinaryPublicIds
    : data.cloudinaryPublicId
      ? [data.cloudinaryPublicId]
      : [];

  const maxIndex = imageUrls.length > 0 ? imageUrls.length - 1 : 0;
  const rawIndex = Number.isInteger(data.thumbnailIndex) ? data.thumbnailIndex : 0;
  const thumbnailIndex = Math.min(Math.max(rawIndex, 0), maxIndex);

  return {
    id: doc.id,
    ...data,
    isPickupAtOxnardFleaMarket: Boolean(data.isPickupAtOxnardFleaMarket),
    isPickupAtCollection: Boolean(data.isPickupAtCollection),
    imageUrls,
    cloudinaryPublicIds,
    thumbnailIndex,
    imageUrl: imageUrls[thumbnailIndex] || imageUrls[0] || null,
    cloudinaryPublicId: cloudinaryPublicIds[thumbnailIndex] || cloudinaryPublicIds[0] || null,
  };
}

// POST /api/items/upload - Upload item with one or more images
router.post('/upload', upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, price, condition, category } = req.body;
    const files = req.files || [];
    const isPickupAtOxnardFleaMarket = parseBooleanField(req.body.isPickupAtOxnardFleaMarket);
    const isPickupAtCollection = parseBooleanField(req.body.isPickupAtCollection);

    if (files.length === 0 || !title || !description || !price || !condition || !category) {
      return res.status(400).json({ error: 'Title, description, price, condition, category, and at least one image are required.' });
    }

    if (!conditionOptions.has(condition)) {
      return res.status(400).json({ error: 'Invalid item condition.' });
    }

    if (!Object.prototype.hasOwnProperty.call(categoryPrefixMap, category)) {
      return res.status(400).json({ error: 'Invalid category.' });
    }

    if (!isValidPrice(price)) {
      return res.status(400).json({ error: 'Invalid price value.' });
    }
    const parsedPrice = Number(price);

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ error: 'Cloudinary is not configured.' });
    }

    const { imageUrls, cloudinaryPublicIds } = await uploadImagesToCloudinary(files);
    const parsedThumbnailIndex = Number.parseInt(req.body.thumbnailIndex ?? '0', 10);
    const thumbnailIndex = Number.isInteger(parsedThumbnailIndex)
      ? Math.min(Math.max(parsedThumbnailIndex, 0), imageUrls.length - 1)
      : 0;
    const imageUrl = imageUrls[thumbnailIndex] || imageUrls[0];
    const cloudinaryPublicId = cloudinaryPublicIds[thumbnailIndex] || cloudinaryPublicIds[0];
    const itemId = await createUniqueCategoryItemId(category);

    const docRef = await db.collection('items').add({
      title,
      description,
      price: parsedPrice,
      condition,
      category,
      isPickupAtOxnardFleaMarket,
      isPickupAtCollection,
      itemId,
      imageUrl,
      imageUrls,
      cloudinaryPublicId,
      cloudinaryPublicIds,
      thumbnailIndex,
      createdAt: new Date()
    });
    res.json({
      id: docRef.id,
      itemId,
      title,
      description,
      price: parsedPrice,
      condition,
      category,
      isPickupAtOxnardFleaMarket,
      isPickupAtCollection,
      imageUrl,
      imageUrls,
      cloudinaryPublicId,
      cloudinaryPublicIds,
      thumbnailIndex,
    });
  } catch (err) {
    console.error('Upload error:', err);

    res.status(500).json({
      error: 'Failed to upload item',
      details: process.env.NODE_ENV === 'production' ? undefined : err.message,
    });
  }
});

// PUT /api/items/:id - Update editable item fields
router.put('/:id', upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, price, condition } = req.body;
    const replaceImages = req.body.replaceImages === 'true' || req.body.replaceImages === true;
    const files = req.files || [];
    const isPickupAtOxnardFleaMarket = parseBooleanField(req.body.isPickupAtOxnardFleaMarket);
    const isPickupAtCollection = parseBooleanField(req.body.isPickupAtCollection);

    if (!title || !description || price === undefined || !condition) {
      return res.status(400).json({ error: 'Title, description, price, and condition are required.' });
    }

    if (!conditionOptions.has(condition)) {
      return res.status(400).json({ error: 'Invalid item condition.' });
    }

    if (!isValidPrice(price)) {
      return res.status(400).json({ error: 'Invalid price value.' });
    }

    const itemRef = db.collection('items').doc(req.params.id);
    const itemDoc = await itemRef.get();
    if (!itemDoc.exists) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const existingItem = normalizeItem(itemDoc);

    const parsedPrice = Number(price);
    const updatePayload = {
      title,
      description,
      price: parsedPrice,
      condition,
      isPickupAtOxnardFleaMarket,
      isPickupAtCollection,
      updatedAt: new Date(),
    };

    let finalImageUrls = [...existingItem.imageUrls];
    let finalCloudinaryPublicIds = [...existingItem.cloudinaryPublicIds];

    if (files.length > 0) {
      const { imageUrls: newImageUrls, cloudinaryPublicIds: newCloudinaryPublicIds } = await uploadImagesToCloudinary(files);

      if (replaceImages) {
        await deleteCloudinaryImageForItem(existingItem);
        finalImageUrls = [...newImageUrls];
        finalCloudinaryPublicIds = [...newCloudinaryPublicIds];
      } else {
        finalImageUrls = [...existingItem.imageUrls, ...newImageUrls];
        finalCloudinaryPublicIds = [...existingItem.cloudinaryPublicIds, ...newCloudinaryPublicIds];
      }
    }

    const parsedThumbnailIndex = Number.parseInt(req.body.thumbnailIndex ?? `${existingItem.thumbnailIndex || 0}`, 10);
    const maxIndex = finalImageUrls.length > 0 ? finalImageUrls.length - 1 : 0;
    const thumbnailIndex = Number.isInteger(parsedThumbnailIndex)
      ? Math.min(Math.max(parsedThumbnailIndex, 0), maxIndex)
      : 0;

    updatePayload.imageUrls = finalImageUrls;
    updatePayload.cloudinaryPublicIds = finalCloudinaryPublicIds;
    updatePayload.thumbnailIndex = thumbnailIndex;
    updatePayload.imageUrl = finalImageUrls[thumbnailIndex] || finalImageUrls[0] || null;
    updatePayload.cloudinaryPublicId = finalCloudinaryPublicIds[thumbnailIndex] || finalCloudinaryPublicIds[0] || null;

    await itemRef.update(updatePayload);

    const updatedDoc = await itemRef.get();
    return res.json(normalizeItem(updatedDoc));
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE /api/items/:id - Remove item from Firestore and Cloudinary
router.delete('/:id', async (req, res) => {
  try {
    const itemRef = db.collection('items').doc(req.params.id);
    const itemDoc = await itemRef.get();
    if (!itemDoc.exists) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const itemData = itemDoc.data();
    await deleteCloudinaryImageForItem(itemData);
    await itemRef.delete();

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete item' });
  }
});

// GET /api/items - Get all items
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('items').orderBy('createdAt', 'desc').get();
    const items = snapshot.docs.map((doc) => normalizeItem(doc));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// GET /api/items/:id - Get single item by document id
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('items').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Item not found' });
    }

    return res.json(normalizeItem(doc));
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch item' });
  }
});

module.exports = router;
