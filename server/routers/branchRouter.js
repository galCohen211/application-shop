const express = require("express");
const BranchController = require("../Controllers/BranchController");

const router = express.Router();

router.get("/", BranchController.getAllBranches);

router.post("/", BranchController.createBranch);

module.exports = router;