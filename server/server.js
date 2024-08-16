
import express from 'express';
import cors from 'cors';
import { SECRET } from "./routers/secret.js";
import { products } from './routers/productRouter.js'
import { users } from './routers/userRouter.js'
import { carts } from './routers/cartRouter.js';
import { orders } from './routers/orderRouter.js';
import path from 'path';
const mongoose = require("mongoose");

//Set up default mongoose connection
const mongoDB = "mongodb://127.0.0.1/onlineshop";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

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


app.listen(PORT, () => console.log(`Server is up at ${PORT}`));