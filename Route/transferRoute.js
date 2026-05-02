import express from "express";
import { transfer } from "../Controller/transferController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Protected route - requires authentication
router.post("/", authMiddleware, transfer);

export default router;
