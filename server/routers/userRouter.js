const express = require("express");
const UserController = require("../Controllers/UserController");
const userController = new UserController();
const router = express.Router();

router.delete('/:userId' , userController.deleteUser.bind(userController));

module.exports = router;