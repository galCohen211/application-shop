const Product = require("../models/Product");
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const path = require("path");
const fs = require("fs");

class ProductController {

    // Get all products
    static async getAllProducts(req, res) {
        const products = await Product.find();
        res.status(200).send(products);
    }

    // Get products by category
    static getProductsByCategory(req, res) {
        Product.find({ category: req.params.category })
            .then(data => res.send(data))
            .catch(err => console.log(err));
    }

    // Add a new product
    static async addProduct(req, res) {

        const errors = validationResult(req);

        // Handle image uploads
        const mainImage = req.files["imagePath"] ? req.files["imagePath"][0] : null;

        if (!mainImage)
            errors.errors.push({
                value: "",
                msg: "Invalid value",
                param: "image",
                location: "body"
            });

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const mainImageUrl = `${req.protocol}://${req.get("host")}/uploads/${mainImage.filename}`;

        let product = new Product({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            brand: req.body.brand,
            size: req.body.size,
            color: req.body.color,
            quantity: req.body.quantity,
            imagePath: mainImageUrl
        });

        product = await product.save();
        if (!product)
            return res.status(500).send("The product cannot be created");

        return res.status(200).send(product);
    }

    // Delete product
    static async deleteProduct(req, res) {

        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send("Invalid product id");
        }

        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).send("Product not found");
        }

        // Delete main image from uploads directory
        if (product.imagePath) {
            const mainImagePath = path.join(__dirname, "../uploads", path.basename(product.imagePath));
            try {
                if (fs.existsSync(mainImagePath)) {
                    fs.unlinkSync(mainImagePath);
                } else {
                }
            } catch (error) {
                console.error("Error occurred while deleting the file:", error);
            }
        }
        res.status(200).send({ message: "Product and associated image deleted successfully", product });
    }
}

module.exports = ProductController;