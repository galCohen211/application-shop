const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  _id: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  city: String,
  street: String,
  gender: String,
  birthDate: Date,
  role: String
});

module.exports = mongoose.model("User", UserSchema);