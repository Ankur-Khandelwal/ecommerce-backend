const mongoose = require('mongoose');
const User = require('./user');
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true 
  },
  stock: {
    type: Number,
    required: true,
  },
  offer: {
    type: Number
  },
  productPictures: [
    {img: {type: String}}
  ],
  reviews: [
    {
      userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      review: String
    }
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Category',
    required: true,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  updatedAt: Date
}, {timestamps: true});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;