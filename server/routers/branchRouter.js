const express = require("express");
const BranchController = require("../Controllers/BranchController");
const { check } = require("express-validator");

const router = express.Router();

router.get("/", BranchController.getAllBranches);

router.post(
  "/",
  check("city").notEmpty(),
  check("street").notEmpty(),
  BranchController.createBranch
);

router.delete("/:id", BranchController.deleteBranch);

router.put("/:id", BranchController.updateBranch);

module.exports = router;
