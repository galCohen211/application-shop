const express = require("express");
const router = express.Router();
const UserController = require('../controllers/UserController')
const { check } = require("express-validator")
const verifyToken = require("../middleware/verifyToken")
const verifyAdminToken = require("../middleware/verifyAdminToken");

// Sign up
router.post(
    "/signup",
    check("firstName").notEmpty(),
    check("lastName").notEmpty(),
    check("email").notEmpty().isEmail(),
    check("password").notEmpty(),
    check("city").notEmpty(),
    check("street").notEmpty(),
    check("gender").notEmpty(),
    check("birthDate").notEmpty(),
    UserController.signUp
);

router.get("/", verifyAdminToken, UserController.getAllUsers);

// Search user
router.get("/search", verifyAdminToken, UserController.searchUser);

router.get(
    "/:id",
    UserController.getUserById
);

// Login
router.post("/login", UserController.login);

// Delete user
router.delete(
    "/:id",
    verifyAdminToken,
    UserController.deleteUser);

// Update user
router.put("/:id",
    check("email").notEmpty().isEmail(),
    check("city").notEmpty(),
    check("street").notEmpty(),
    verifyToken,
    UserController.updateUser);

module.exports = router;