const Cart = require("../models/Cart");
const Product = require('../models/Product');
const CartItem = require("../models/CartItem");
const Order = require("../models/Order");

class CartController {
    static getCart(req, res) {
        Cart.findOne({ user: req.query.id, active: true }).then(cart => {
            if (cart === null) {
                Order.find({ user: req.query._id }).then(order => {
                    if (order.length > 0) {
                        res.send({
                            cart: {},
                            lastOrder: order[order.length - 1].dateOrdered
                        });
                    } else {
                        res.send({ cart: {} });
                    }
                });
            } else {
                CartItem.find({ cart: cart._id })
                    .populate("product").then((cartItems) => {
                        res.send({ cart, cartItems });
                    }).catch((err) => {
                        throw err;
                    });
            }
        });
    }

    static async addProductToCart(req, res) {
        let { cart } = req.query;
        const { user } = req.query;
        const { product, amount } = req.body;
        const date = new Date()
            .toJSON()
            .slice(0, 10)
            .split("-")
            .reverse()
            .join("/");
        try {
            // Find the product and check its quantity
            const productDoc = await Product.findById(product._id);
            if (!productDoc) {
                return res.status(404).send({ error: "Product not found" });
            }

            if (productDoc.quantity < amount) {
                return res.status(400).send({ error: "Not enough product quantity available" });
            }

            // Check if the product is already in the user's cart
            const existingCart = await Cart.findOne({ user: user, active: true });
            if (existingCart) {
                const existingCartItem = await CartItem.findOne({
                    cart: existingCart._id,
                    product: product._id
                });
                if (existingCartItem) {
                    return res.status(400).send({ error: "Product is already in the cart" });
                }
            } else {
                // Create new cart if not provided
                cart = new Cart({
                    date: date,
                    user,
                    active: true
                });
                await cart.save(); 
            }

            const newCartItem = new CartItem({
                product: product._id,
                amount,
                price: product.price * amount,
                cart: existingCart ? existingCart._id : cart._id // Use existing cart if available
            });

            // Save cart item and populate product
            const savedCartItem = await newCartItem.save();
            const populatedCartItem = await CartItem.findById(savedCartItem._id).populate('product').exec();

            res.send({
                cart: existingCart ? existingCart : cart, // Send existing cart if available, otherwise new cart
                newCartItem: populatedCartItem
            });
        } catch (error) {
            console.error("Error adding product to cart:", error);
            res.status(500).send({ error: "An error occurred while adding the product to the cart" });
        }
    }


    static deleteProductFromCart(req, res) {
        const { cart, item } = req.query;
        CartItem.findOneAndDelete({ _id: item, cart }).then(item => {
            res.send(item);
        });
    }
}

module.exports = CartController;