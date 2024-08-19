const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  city: String,
  street: String,
  gender: String,
  birthDate: Date,
  role: {
    type: String,
    default: "user"
  }
});

module.exports = mongoose.model("User", UserSchema);