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

    // Get products by category, brand, or size
    static getProductsByField(req, res) {
        const { category, brand, size, gender } = req.query;
        let filter = {};

        // Add filters based on the presence of query parameters
        if (category) {
            filter.category = category;
        }
        if (brand) {
            filter.brand = brand;
        }
        if (size) {
            filter.size = size;
        }
        if (gender) {
            filter.gender = gender;
        }

        // Find products based on the constructed filter
        Product.find(filter)
            .then(data => res.send(data))
            .catch(err => {
                console.error(err);
                res.status(500).send("Error retrieving products");
            });
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

        const mainImageUrl = `${req.protocol}://${req.get("host")}/server/uploads/${mainImage.filename}`;

        let product = new Product({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            brand: req.body.brand,
            size: req.body.size,
            color: req.body.color,
            quantity: req.body.quantity,
            gender: req.body.gender,
            imagePath: mainImageUrl
        });

        product = await product.save();
        if (!product)
            return res.status(500).send("The product cannot be created");

        return res.status(200).send(product);
    }

    // Get Product By Id
    static async getProductById(req, res) {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).send("Invalid product id");
        }
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send("Product not found");
        }
        res.status(200).send({ message: "Found Product successfully", product });
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

    // Update product
    static async updateProduct(req, res) {

        const productId = req.params.id;

        // Check if the product exists
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).send("Product not found");
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Handle image uploads and deletions
        let mainImageUrl = existingProduct.imagePath;

        // Determine which images should be deleted
        const existingImages = req.body.existingImages ? req.body.existingImages.split(",") : [];

        // Delete the old main image if a new one is uploaded
        if (req.files["imagePath"]) {
            const mainImage = req.files["imagePath"][0];

            // Delete the old main image from the uploads directory
            if (existingProduct.imagePath && !existingImages.includes(existingProduct.imagePath)) {
                const oldMainImagePath = path.join(__dirname, "../uploads", path.basename(existingProduct.imagePath));
                if (fs.existsSync(oldMainImagePath)) {
                    fs.unlinkSync(oldMainImagePath);
                }
            }

            mainImageUrl = `${req.protocol}://${req.get("host")}/server/uploads/${mainImage.filename}`;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name: req.body.name || existingProduct.name,
                category: req.body.category || existingProduct.category,
                price: req.body.price || existingProduct.price,
                brand: req.body.brand || existingProduct.brand,
                size: req.body.size || existingProduct.size,
                color: req.body.color || existingProduct.color,
                quantity: req.body.quantity || existingProduct.quantity,
                gender: req.body.gender || existingProduct.gender,
                imagePath: mainImageUrl
            },
            { new: true }
        )

        if (!updatedProduct) return res.status(500).send("The product cannot be updated");
        res.status(200).send(updatedProduct);
    }

    // Search product by name
    static async searchProduct(req, res) {
        const { name } = req.query;

        if (!name) {
            return res.status(400).send("Product name is required");
        }

        try {
            // Use regex to perform a case-insensitive search
            const products = await Product.find({
                name: { $regex: name, $options: "i" }
            });

            if (products.length === 0) {
                return res.status(404).send("No products found");
            }

            res.status(200).send(products);
        } catch (err) {
            console.error(err);
            res.status(500).send("Error occurred while searching for products");
        }
    }
}

module.exports = ProductController;
