import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getProfile)
  .post(protect, authorize("admin"), updateProfile);

export default router;
