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

router.delete('/:userId' , userController.deleteUser.bind(userController));

module.exports = router;