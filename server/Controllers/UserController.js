const User = require("../models/user");
const mongoose = require('mongoose');


class UserController {
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
