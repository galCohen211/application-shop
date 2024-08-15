import express from 'express';
import cors from 'cors';
import { SECRET } from "./routers/secret";
import { products } from './routers/productRouter.ts'
import { users } from './routers/userRouter.ts'
import { carts } from './routers/cartRouter.ts';
import { orders } from './routers/orderRouter.ts';
import path from 'path';
import { expressjwt } from "express-jwt";

import {closeDb} from  './db.ts';


const PORT = 4000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(
    expressjwt({
        secret: SECRET,
        algorithms: ["HS256"],
    }).unless({ path: ["/token"] })
);

app.use('/users', users);
app.use('/products', products);
app.use('/carts', carts);
app.use('/orders', orders);


app.listen(PORT, () => console.log(`Server is up at ${PORT}`));
process.on('SIGINT', function () {  //sigint its event it will happen when fire the event
    console.log('closing mongo connection');
    closeDb();
})