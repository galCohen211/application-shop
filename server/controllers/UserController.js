const User = require("../models/user");
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const SECRET = require('../routers/secret');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('Y724624414737-b6sqaet5vul4it8q3gk9prdmb641unfd.apps.googleusercontent.com');

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
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(400).json({ errors: validationErrors.array() });
        }
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
        console.log(users)
        if (users.length != 0) {
            res.status(200).send(users);
        }
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
        try {
            const userId = req.params.id;

            if (!mongoose.isValidObjectId(userId)) {
                return res.status(400).send('Invalid user ID');
            }

            // Find the user trying to be updated
            const existingUser = await User.findById(userId);
            if (!existingUser) {
                return res.status(404).send('The user cannot be found');
            }

            // Check if the email is being changed
            if (req.body.email !== existingUser.email) {
                // If the email is being changed, check if the new email is already taken
                const emailInUse = await User.findOne({ email: req.body.email });
                if (emailInUse) {
                    return res.status(400).json({ success: false, message: "The email is already taken. Did not update" });
                }
            }

            // Validate other fields
            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                return res.status(400).json({ errors: validationErrors.array() });
            }

            // Update user details
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    email: req.body.email,
                    city: req.body.city,
                    street: req.body.street
                },
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).send('The user cannot be found');
            }

            return res.status(200).json({ success: true, newUser: updatedUser });
        } catch (error) {
            return res.status(500).send('Server error');
        }
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

    // Search user by email
    static async searchUser(req, res) {
        const { name } = req.query;

        if (!name) {
            return res.status(400).send("email is required");
        }
        try {
            // Use regex to perform a case-insensitive search
            const users = await User.find({
                email: { $regex: name, $options: "i" }
            });

            if (users.length === 0) {
                return res.status(404).send("No users found");
            }

            res.status(200).send(users);
        } catch (err) {
            console.error(err);
            res.status(500).send("Error occurred while searching for users");
        }
    }

    // Google Login
    static async googleLogin(req, res) {
        const { idToken } = req.body;

        // Verify the Google ID token
        let ticket;
        try {
            ticket = await client.verifyIdToken({
                idToken,
                audience: '724624414737-b6sqaet5vul4it8q3gk9prdmb641unfd.apps.googleusercontent.com',
            });
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Invalid Google token' });
        }

        const payload = ticket.getPayload();
        const { email, given_name: firstName, family_name: lastName } = payload;

        // Check if user exists in the database
        let user = await User.findOne({ email });

        // If user doesn't exist, create a new user with 'user' role
        if (!user) {
            user = new User({
                email,
                firstName,
                lastName,
                role: 'user', // Default role
                city: '', // Optionally set default fields
                street: '',
                gender: ''
            });
            await user.save();
        }

        // Generate JWT for the user
        const accessToken = jwt.sign(
            { userId: user.id, role: user.role },
            SECRET
        );

        // Respond with user info and access token
        res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            city: user.city,
            street: user.street,
            gender: user.gender,
            role: user.role,
            accessToken,
            success: true
        });
    }
}


module.exports = UserController;