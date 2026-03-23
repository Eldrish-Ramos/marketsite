const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', ItemSchema);
