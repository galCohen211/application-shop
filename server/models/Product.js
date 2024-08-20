const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  brand: String,
  size: String,
  color: String,
  quantity: Number,
  imagePath: String
});

module.exports = mongoose.model("Product", ProductSchema);