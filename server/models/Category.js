// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null, // Means "no parent" by default
  },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
