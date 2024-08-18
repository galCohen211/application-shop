const mongoose = require("mongoose");
const CartItemSchema = mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  amount: Number,
  price: Number
});

module.exports = mongoose.model("CartItem", CartItemSchema);