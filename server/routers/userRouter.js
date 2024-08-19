const express = require("express");
const router = express.Router();
const UserController = require('../Controllers/UserController')
const { check } = require("express-validator")

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

router.get(
    "/getUserById/:id",
    UserController.getUserById
);

router.get(
    "/getAllUsers",
    UserController.getAllUsers
);

// Login
router.post("/login", UserController.login);

// Delete user
router.delete("/:id", UserController.deleteUser);

// Update user
router.put("/:id",
    check("email").notEmpty().isEmail(),
    check("city").notEmpty(),
    check("street").notEmpty(),
     UserController.updateUser);


module.exports = router;