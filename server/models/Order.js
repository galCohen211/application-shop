const mongoose = require("mongoose");
const OrderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.String, ref: "User" },
  cart: { type: mongoose.Schema.Types.String, ref: "Cart" },
  totalPrice: Number,
  city: String,
  street: String,
  dateOrdered: Date,
  creditcard: String
});

module.exports = mongoose.model("Order", OrderSchema);