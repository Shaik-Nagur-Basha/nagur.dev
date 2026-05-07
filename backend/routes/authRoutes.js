import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  updatePassword,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // Increased for development/testing
  message: {
    error: "Too many login attempts, please try again after 15 minutes",
  },
});

// router.post("/register", register); // Disabled registration
router.post("/login", authLimit, login);
router.get("/logout", protect, logout);
router.get("/me", protect, getMe);
router.put("/update-password", protect, updatePassword);


export default router;
