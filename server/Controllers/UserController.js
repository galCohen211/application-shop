const User = require("../models/user");
const { validationResult } = require('express-validator');
class UserController {

    static async getUserById(req, res) {
        let userId = req.body._id
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty) { // maybe omit !
            return res.status(400).json({ errors: validationErrors.array() })
        }
    }

}

module.exports = UserController;
