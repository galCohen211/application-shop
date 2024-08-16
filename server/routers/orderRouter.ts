import express from "express";
import { connect } from "../db";
import { ObjectId } from "mongodb";
import { orderSchema } from "../schemas/orderSchema";


const router = express.Router();


export { router as orders };