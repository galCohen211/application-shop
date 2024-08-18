const User = require("../models/user");

class UserController {

    // login
    // register
    async registerUser (req, res) {
        console.log("registerUser controller");
        
        try {
            const {
                firstName, 
                lastName, 
                email, 
                password, 
                city, 
                street, 
                gender,
                birthDate, 
                role
            } = req.body;

            const existUser = await User.find({ email}, function (err) {
                if (err) {
                    console.error(err);
                }
            });

            if (existUser) {
                return res.status(400).json({message: 'User already registerd'});
            }

            await Tank.create({
                firstName, 
                lastName, 
                email, 
                password, 
                city, 
                street, 
                gender,
                birthDate, 
                role
            }, function (err) {
                if (err) throw err;
            });
            
            return res.status(200).json({message: 'User registered successfuly'});

        } catch (error) {
            console.error(error);
            return res.status(500).json({message: 'server error'});
        }
    }

    // delete user
    async deleteUser (req, res){
        try {
            const {userId} = req.parmas;

            const existUser = await User.findById(userId);

            if(!existUser) {
                return res.status(400).json({message: 'User not found'});
            }

            await User.deleteOne({_id: userId}, function (err) {
                if (err) throw err;
            });
            
            return res.status(200).json({message: 'Delete success'});

        } catch (error) {
            console.error(error);
            return res.status(500).json({message: 'server error'});
        }
    }

    // update user

}

module.exports = UserController;

