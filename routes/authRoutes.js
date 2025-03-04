import express from "express";
import { registerUser, loginUser } from "../controllers/authControllers.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/register", upload, registerUser);
router.post("/login", loginUser);

export default router