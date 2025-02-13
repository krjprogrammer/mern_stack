// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  dateOfSale: Date,
  sold: { type: Boolean, default: false },
});

module.exports = mongoose.model('Transaction', transactionSchema);
