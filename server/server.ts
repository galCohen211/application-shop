import express from 'express';
import cors from 'cors';
import { SECRET } from "./routers/secret";
import { products } from './routers/productRouter.ts'
import { users } from './routers/userRouter.ts'
import { carts } from './routers/cartRouter.ts';
import { orders } from './routers/orderRouter.ts';
import path from 'path';
import expressJwt from 'express-jwt';

const app = express();

app.use(express.json());
app.use(cors());
app.use(expressJwt({ secret: SECRET }).unless({ path: ['ALLPATHSHERE'] }));

app.use('/users', users);
app.use('/products', products);
app.use('/carts', carts);
app.use('/orders', orders);