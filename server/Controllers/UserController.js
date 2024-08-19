const User = require("../models/user");
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const SECRET = require('../routers/secret');

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
    async deleteUser(req, res) {
      try {
  
        const { userId } = req.params;
        console.log('user:', userId);
  
        const userExists = await User.findById(userId);
        console.log('exist:', userExists);
        if (!userExists) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
  
        const deletedUser = await User.findByIdAndDelete(userId);
        console.log('Deleted user:', deletedUser);
  
        return res.status(200).json({ success: true, message: "Delete success" });
  
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "server error" });
      }
    }
  
    // update user


}

module.exports = UserController;
