const express = require("express");
const { check } = require("express-validator");
const ProductController = require("../controllers/ProductController");
const upload = require('../multer');

const verifyAdminToken = require("../middleware/verifyAdminToken");

const router = express.Router();

// Get all products
router.get("/", ProductController.getAllProducts);

// Get products by field
router.get("/field", ProductController.getProductsByField);


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
    check("gender")
        .notEmpty()
        .isString(),
    ProductController.addProduct
);

// Update product
router.put(
    "/:id",
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
    check("gender")
        .notEmpty()
        .isString(),
    ProductController.updateProduct
);

// Search product
router.get("/search", ProductController.searchProduct);

// Delete product
router.delete("/:id", verifyAdminToken, ProductController.deleteProduct);

// Get Product by Id
router.get("/:id", verifyAdminToken, ProductController.getProductById);


module.exports = router;