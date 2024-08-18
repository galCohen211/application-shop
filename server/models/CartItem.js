const mongoose = require("mongoose");
const CartItemSchema = mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  amount: Number,
  price: Number,
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" }
});

module.exports = mongoose.model("CartItem", CartItemSchema);