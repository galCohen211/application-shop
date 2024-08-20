const Branch = require("../models/Branch");

class BranchController {
  static async getAllBranches(_req, res) {
    const branches = await Branch.find();
    return res.status(200).json(branches);
  }

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
}

module.exports = BranchController;
