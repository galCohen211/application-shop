// - How to reload the script to work with the DB
// mongosh "mongodb+srv://cluster0.et32z.mongodb.net/onlineshop" --apiVersion 1 --username milanezi45 server/db.js
// Password will be shared in whatsapp

// use onlineshop

db.products.insertMany([
    { name: "Casual Jacket", category: "Jackets", price: 40.90, brand: "ZARA", size: "XL", color: "black", inStock: 12, imagePath: "../assets/images/men/jacket.png" },
    { name: "Business Shirt", category: "Shirts", price: 50.90, brand: "ZARA", size: "M", color: "blue", inStock: 15, imagePath: "../assets/images/men/shirt.png" },
    { name: "Polo Shirt", category: "Polos", price: 55.90, brand: "Tommy Hilfiger", size: "S", color: "white", inStock: 17, imagePath: "../assets/images/men/white_polo.png" },
    { name: "Dress", category: "Dresses", price: 20.90, brand: "ZARA", size: "L", color: "green", inStock: 8, imagePath: "../assets/images/women/green_dress.png" },
    { name: "Business Jacket", category: "Jackets", price: 100.90, brand: "Tommy Hilfiger", size: "M", color: "black", inStock: 19, imagePath: "../assets/images/women/jacket.png" },
    { name: "T-Shirt", category: "Shirts", price: 18.90, brand: "ZARA", size: "S", color: "white", inStock: 2, imagePath: "../assets/images/women/shirt.png" },
]);