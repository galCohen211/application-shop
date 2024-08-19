const User = require("../models/user");
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const SECRET = require('../routers/secret');
const mongoose = require('mongoose');

class UserController {

    // Sign up logic
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
            return res.status(400).json({ errors: validationErrors.array() })
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

    // login
    // register
    // delete user

    // update user
    //Where in the signature of the function do I add the word "function"?
    static async updateUser(req, res) {
        const updateableKeys = {
            email: req.body.email,
            //password: bcrypt.hashSync(req.body.password, 5),,
            city: req.body.city,
            street: req.body.street
        };
        const user = await User.findOne({ email: body.email });

        
        //I need to check the email's validation. check how or validated this. 2
        //params - req.params - how to find ID and check if user exists 1
        //findbyidandupdate - read about this 3
        
    
      }
    // Login logic
    static async login(req, res) {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'The user not found' });
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

    // Delete user
    static async deleteUser(req, res) {

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid user ID');
        }
        User.findByIdAndDelete( req.params.id ).then(user => {
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
