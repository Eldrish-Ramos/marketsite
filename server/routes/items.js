const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new item
router.post('/', async (req, res) => {
  try {
    const { title, price, description, image } = req.body;
    const item = new Item({ title, price, description, image });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

module.exports = router;
