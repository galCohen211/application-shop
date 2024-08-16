import express from "express";
import { connect } from "../db";
import { ObjectId } from "mongodb";
import { cartSchema } from "../schemas/cartSchema";

const router = express.Router();



export { router as carts };