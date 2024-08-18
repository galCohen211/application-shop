const mongoose = require("mongoose");
const CartSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.String, ref: "User" },
  creationDate: Date,
  active: Boolean
});

module.exports = mongoose.model("Cart", CartSchema);