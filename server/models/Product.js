const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  brand: String,
  size: String,
  color: String,
  inStock: Number,
  imagePath: String
});

module.exports = mongoose.model("Product", ProductSchema);