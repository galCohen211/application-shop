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
}

module.exports = UserController;