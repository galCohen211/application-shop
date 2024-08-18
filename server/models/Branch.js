const mongoose = require("mongoose");
const BranchSchema = mongoose.Schema({
  city: String,
  street: String,
  coordinates: String
});

module.exports = mongoose.model("Branch", BranchSchema);