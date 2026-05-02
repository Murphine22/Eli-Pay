import express from "express";
import { userController } from "../Controller/userController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected routes - require authentication
router.get("/profile", authMiddleware, userController.getProfile);
router.post("/set-pin", authMiddleware, userController.setTransactionPin);

export default router;
