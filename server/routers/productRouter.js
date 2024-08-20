const express = require("express");
const { check } = require("express-validator")
const ProductController = require("../Controllers/ProductController");
const upload = require('../multer');

const verifyToken = require("../middleware/verifyToken")
const verifyAdminToken = require("../middleware/verifyAdminToken");

const router = express.Router();

// Get all products
router.get("/", ProductController.getAllProducts);

// Get products by category
router.get("/:category", ProductController.getProductsByCategory);


//Add product
router.post(
    "/",
    upload.fields([
        { name: "imagePath", maxCount: 1 },
    ]),
    verifyAdminToken,
    check("name")
        .notEmpty()
        .isString(),
    check("category")
        .notEmpty()
        .isString(),
    check("price")
        .notEmpty()
        .isNumeric(),
    check("brand")
        .notEmpty()
        .isString(),
    check("size")
        .notEmpty()
        .isString(),
    check("color")
        .notEmpty()
        .isString(),
    check("quantity")
        .notEmpty()
        .isNumeric(),
    ProductController.addProduct
);

// Delete product
router.delete("/:id", verifyAdminToken, ProductController.deleteProduct);



module.exports = router;