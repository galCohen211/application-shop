
const express = require("express");
const cors = require('cors');

const products = require('./routers/productRouter.js');
const users = require('./routers/userRouter.js');
const carts = require('./routers/cartRouter.js');
const orders = require('./routers/orderRouter.js');
const branches = require('./routers/branchRouter.js')

const mongoose = require("mongoose");

//Set up default mongoose connection
const mongoDB = "mongodb+srv://milanezi45:eMut4vPp0d5swc45@cluster0.et32z.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoDB);

//Get the default connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected");
});

const PORT = 4000;

const app = express();

app.use(express.json());
app.use(cors());


app.use('/users', users);
app.use('/products', products);
app.use('/carts', carts);
app.use('/orders', orders);
app.use('/branches', branches);

app.get('/oriya', (req, res) => {
  res.send('Oriyaaaaaaa');
});

app.listen(PORT, () => console.log(`Server is up at ${PORT}`));