const mongoose = require("mongoose");
const BranchSchema = mongoose.Schema({
  city: String,
  street: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
});

module.exports = mongoose.model("Branch", BranchSchema);
