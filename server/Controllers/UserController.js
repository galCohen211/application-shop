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

    static async updateUser(req, res) {

        userid=req.params.id;
        if (!mongoose.isValidObjectId(userid)) {
            return res.status(400).send('Invalid user ID');
        }
        User.findOne({ email: req.body.email }).then(user=>{
            if(user){
                return res.status(404).json({ success: false, message: "Invalid Email - Did not Update" });//This means there is another user with the same email
            }
            else if(!req.body.email.isEmpty()){
                Model.findByIdAndUpdate(userid, req.body.email);
                res.status(200).json({ success: true, message: "Email Updated Successfully" });
            }
        })
        if(!req.body.city.isEmpty()){
            Model.findByIdAndUpdate(userid, req.body.city);
            res.status(200).json({ success: true, message: "City Updated Successfully" });
        }
        else{
            Model.findByIdAndUpdate(userid, user.city);
            res.status(500).json({ success: false, message: "City left blank - Did not update" });
        }
        if(!req.body.street.isEmpty()){
            Model.findByIdAndUpdate(userid, req.body.street);
            res.status(404).json({ success: true, message: "Street Updated Successfully" });
        }
        else{
            Model.findByIdAndUpdate(userid, user.street);
            res.status(500).json({ success: false, message: "Street left blank - Did not update" });
        }
          
        if(success.isEmpty())
            return res.status(500).json({ message: "server error", error: err });
        else
        return;
    }
        
        //I need to check the email's validation. check how or validated this. 2
        //params - req.params - how to find ID and check if user exists 1
        //findbyidandupdate - read about this 3

        //steps: check if id is valid, then const { validationResult } = require('express-validator') read about the validation - check
        //the new email is valid (if he changed it).
        // pass all the parameters back
        //mongoose replaceone - read
        //findbyidandupdate - read
        //update user with post node js - search this


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
