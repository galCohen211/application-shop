const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  _id: String,
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  city: String,
  street: String,
  role: String
});

module.exports = mongoose.model("User", UserSchema);