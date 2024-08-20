const product = require("../models/product");
const mongoose = require('mongoose');

class ProductController {


//Add Product
static async addProduct(req,res){
    let newProduct = new Product({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        brand: req.body.brand,
        size: req.body.size,
        color: req.body.color,
        inStock: req.body.inStock,
        imagePath: req.body.imagePath
    })

    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() })
    }

    newProduct.save();
    res.status(200).send({
        name: user.name,
        category: user.category,
        price: user.price,
        brand: user.brand,
        size: user.size,
        color: user.color,
        inStock: user.inStock,
        imagePath: user.imagePath,
    });

}





//Delete Product
// static async deleteProduct(req,res){
//     const productId=req.params.id;
//     if (!mongoose.isValidObjectId(productId)) {
//         return res.status(400).send('Invalid Product');
//     }
//     Product.findByIdAndDelete(productId).then(product => {
//         if (product) {
//             return res.status(200).json({ success: true, message: "The product is deleted" });
//         }
//         else {
//             return res.status(404).json({ success: false, message: "Product is not found" });
//         }
//     }).catch(err => {
//         return res.status(500).json({ message: "server error", error: err });
//     });

// }
}


module.exports = ProductController;