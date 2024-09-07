const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const CartItem = require("../models/CartItem");
const { validationResult } = require('express-validator');


class OrderController {

    // Get all orders
    static getAllOrders(req, res) {
        Order.find({})
            .then(data => res.send({ amount: data.length, data: data }))
            .catch(err => console.log(err));
    }

    // Get user orders
    static async getUserOrders(req, res) {
        try {
            // Fetch user orders and populate the cart
            const userOrderHistory = await Order.find({ user: req.params.id })
                .populate({ path: 'cart' })
                .sort({ 'dateOrdered': -1 });

            // Iterate over each order to fetch the cart items
            const ordersWithItems = await Promise.all(userOrderHistory.map(async (order) => {

                // Find the cart items for the specific cart and populate the product field
                const cartItems = await CartItem.find({ cart: order.cart._id })
                    .populate('product');

                return {
                    ...order._doc, 
                    cartItems: cartItems // Add the cart items to the order object
                };
            }));
            res.send({ amount: ordersWithItems.length, data: ordersWithItems });
        } catch (error) {
            res.status(500).send({ message: 'Error fetching orders', error });
        }
    }

    // Submit an order
    static async orderCart(req, res) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { city, street, creditcard, totalPrice, user, cart } = req.body;
        const lastFourDigits = creditcard.slice(12, 16);

        try {
            // Find the cart and its items
            const cartItems = await CartItem.find({ cart }).populate('product');

            // Check if any product's required amount exceeds its available quantity
            for (const item of cartItems) {
                if (item.amount > item.product.quantity) {
                    return res.status(400).json({ error: `Insufficient quantity for product ${item.product.name}` });
                }
            }

            // Remove the ordered quantity from each product's stock
            for (const item of cartItems) {
                const product = item.product;
                product.quantity -= item.amount;
                await product.save();
            }

            // Get the current date for dateOrdered
            const dateOrdered = new Date()
                .toJSON()
                .slice(0, 10)
                .split("-")
                .reverse()
                .join("/");

            // Create the new order
            const newOrder = new Order({
                user,
                cart,
                totalPrice,
                city,
                street,
                dateOrdered,
                creditcard: lastFourDigits
            });

            await newOrder.save();

            // Mark the cart as inactive
            await Cart.findByIdAndUpdate(cart, { active: false });

            res.send({ orderSubmitted: true });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to submit order" });
        }
    }

    static async groupOrdersByCity(req, res) {
        try {
            const groupedOrders = await Order.aggregate([
                {
                    $group: {
                        _id: "$city",  // Group by city
                        totalSales: { $sum: "$totalPrice" },  // Sum the totalPrice for each group
                        orderCount: { $sum: 1 }  // Count the number of orders in each city
                    }
                },
                {
                    $sort: { totalSales: -1 }
                }
            ]);

            res.status(200).json({ groupedOrders });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to group orders by city" });
        }
    }
}

module.exports = OrderController;
