const express = require("express");
const { check } = require("express-validator")
const ProductController = require("../Controllers/ProductController");


const router = express.Router();



//Add product
router.post(
    "/products",
    check("name").notEmpty(),
    check("category").notEmpty(),
    check("price").notEmpty(),
    check("brand").notEmpty(),
    check("size").notEmpty(),
    check("color").notEmpty(),
    check("inStock").notEmpty(),
    check("imagePath").notEmpty(),
    ProductController.addProduct
);

// Delete product
router.delete("/:id", ProductController.deleteProduct);

module.exports = router;