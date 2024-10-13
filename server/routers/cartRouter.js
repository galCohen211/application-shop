const express = require("express");
const CartController = require('../controllers/CartController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Get cart
router.get("/", verifyToken, CartController.getCart);

// Add products to cart
router.post("/", verifyToken, CartController.addProductToCart);

// Delete procudt from cart
router.delete("/", verifyToken, CartController.deleteProductFromCart);

// Modify cart item amount
router.put("/item/:itemId", CartController.updateCartItemAmount);


module.exports = router;