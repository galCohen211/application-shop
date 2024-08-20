const Branch = require("../models/Branch");
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');


class BranchController {

  //Get all branches
  static async getAllBranches(_req, res) {
    const branches = await Branch.find();
    return res.status(200).json(branches);
  }

  //Create branch
  static async createBranch(req, res) {
    const { city, street, coordinates } = req.body;

    let newBranch = new Branch({
      city,
      street,
      coordinates,
    });

    newBranch
      .save()
      .then((branch) => {
        res.status(200).send({
          city,
          street,
          coordinates,
        });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ message: "branch not create", error: err });
      });
  }

  //Delete branch
  static async deleteBranch(req, res){
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('Invalid branch ID');
    }
    Branch.findByIdAndDelete(req.params.id).then(branch => {
      if (branch) {
        return res.status(200).json({ success: true, message: "The branch is deleted" });
      }
      else {
        return res.status(404).json({ success: false, message: "Branch is not found" });
      }
    }).catch(err => {
      return res.status(500).json({ message: "server error", error: err });
    });
  }

  //Update branch
  static async updateBranch(req, res){
    
  }
}

module.exports = BranchController;
