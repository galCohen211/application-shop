const express = require("express");
const BranchController = require("../controllers/BranchController");
const { check } = require("express-validator");
const verifyAdminToken = require("../middleware/verifyAdminToken");

const router = express.Router();

router.get("/", BranchController.getAllBranches);

router.post(
  "/",
  verifyAdminToken,
  check("city").notEmpty(),
  check("street").notEmpty(),
  BranchController.createBranch
);

router.delete("/:id", verifyAdminToken, BranchController.deleteBranch);

router.put("/:id", verifyAdminToken, BranchController.updateBranch);

// Search branch
router.get("/search", verifyAdminToken, BranchController.searchBranch);

module.exports = router;
