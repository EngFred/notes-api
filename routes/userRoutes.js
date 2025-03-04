import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { deleteUser, getUserProfile, updateUser } from "../controllers/userControllers.js";
import upload from "../middlewares/uploadMiddleware.js";

const router  = express.Router()

router.put("/update", protect, upload, updateUser)
router.get("/profile", protect, getUserProfile)
router.delete("/delete", protect, deleteUser)

export default router;