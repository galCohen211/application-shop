const User = require("../models/user");
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const SECRET = require('../routers/secret');
const mongoose = require('mongoose');

class UserController {

    // Validates that request error array is empty
    static validateReqErrIsEmpty(req, res) {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(400).json({ errors: validationErrors.array() });
        }
        return;
    }

    // Sign up
    static async signUp(req, res) {
        let newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 5),
            city: req.body.city,
            street: req.body.street,
            gender: req.body.gender,
            birthDate: req.body.birthDate
        })
        validateReqErrIsEmpty(req, res);
        const errors = [];
        const { email, birthDate } = req.body;
        await User.find({ email }).then(user => {
            if (user.length > 0) {
                errors.push({ email: "unavailable" });
            }
        })
        const userDate = new Date(birthDate);
        const currentDate = new Date();
        if (currentDate < userDate) {
            errors.push({ date: "unavailable" });
        }
        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }
        newUser.save().then(user => {
            const accessToken = jwt.sign(
                { userId: user.id, role: user.role },
                SECRET
            );
            res.status(200).send({
                firstName: user.firstName,
                lastName: user.lastName,
                city: user.city,
                street: user.street,
                gender: user.gender,
                role: user.role,
                accessToken
            });
        });
    }

    // Get user by ID
    static async getUserById(req, res) {

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid user ID');
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(400).send('User ID not found');
        }
        return res.status(200).json({ user });
    }

    // Get all users
    static async getAllUsers(req, res) {
        const users = await User.find({});
        if (!users) {
            return res.status(400).json("No users")
        }
        return res.status(200).json({ users });
    }

    // Login
    static async login(req, res) {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user && bcrypt.compareSync(password, user.password)) {
            const accessToken = jwt.sign(
                { userId: user.id, role: user.role },
                SECRET
            );
            res.status(200).send({
                firstName: user.firstName,
                lastName: user.lastName,
                city: user.city,
                street: user.street,
                gender: user.gender,
                role: user.role,
                accessToken
            });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid password!' });
        }
    }

    // Update user
    static async updateUser(req, res) {
        const userId = req.params.id;
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send('Invalid user ID');
        }
        User.findOne({ email: req.body.email }).then(user => {
            if (user) {
                // This means there is another user with the same email
                return res.status(400).json({ success: false, message: "Invalid email. Did not update" });
            }
        });
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(400).json({ errors: validationErrors.array() })
        }
        const user = await User.findByIdAndUpdate(
            userId,
            {
                email: req.body.email,
                city: req.body.city,
                street: req.body.street
            },
            { new: true }
        );
        if (!user) {
            return res.status(404).send('The user cannot be found');
        }
        res.status(200).json({ success: true, newUser: user });
    }

    // Delete user
    static async deleteUser(req, res) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid user ID');
        }
        User.findByIdAndDelete(req.params.id).then(user => {
            if (user) {
                return res.status(200).json({ success: true, message: "The user is deleted" });
            }
            else {
                return res.status(404).json({ success: false, message: "User is not found" });
            }
        }).catch(err => {
            return res.status(500).json({ message: "server error", error: err });
        });
    }
}

module.exports = UserController;