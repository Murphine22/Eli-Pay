import express from "express";
import { accountController } from "../Controller/accountController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Protected routes - require authentication
router.get("/balance", authMiddleware, accountController.getBalance);
router.get("/transactions", authMiddleware, accountController.getTransactionHistory);
router.get("/transaction/:reference", authMiddleware, accountController.checkTransactionStatus);
router.post("/name-enquiry", authMiddleware, accountController.nameEnquiry);

export default router;
