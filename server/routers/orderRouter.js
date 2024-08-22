const express = require("express");
const OrderController = require("../controllers/OrderController");
const { check } = require("express-validator");

const verifyAdminToken = require("../middleware/verifyAdminToken");
const verifyToken = require('../middleware/verifyToken');


const router = express.Router();

// Get all orders
router.get("/", verifyAdminToken, OrderController.getAllOrders);

// Get user orders
router.get("/:id", verifyToken, OrderController.getUserOrders);

// Submit an order
router.post("/", verifyToken,
    check("totalPrice")
        .notEmpty()
        .isNumeric(),
    check("city")
        .notEmpty()
        .isString(),
    check("street")
        .notEmpty()
        .isString(),
    check("creditcard")
        .notEmpty()
        .isString(), OrderController.orderCart);

module.exports = router;