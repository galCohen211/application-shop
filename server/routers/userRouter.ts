import express from "express";
import { SECRET } from "./secret";
import jwt from "jsonwebtoken";
import { connect } from '../db';
import { userSchema } from '../schemas/userSchema';
import { compare, hash } from 'bcrypt';
import { loginSchema } from "../schemas/loginSchema";

const router = express.Router();


export { router as users };