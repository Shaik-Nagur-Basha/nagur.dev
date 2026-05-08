import express from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  updateProjectOrder,
} from "../controllers/projectController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.put("/order", protect, authorize("admin"), updateProjectOrder);

router
  .route("/")
  .get(getProjects)
  .post(protect, authorize("admin"), upload.single("media"), createProject);

router
  .route("/:id")
  .get(getProject)
  .put(protect, authorize("admin"), upload.single("media"), updateProject)
  .delete(protect, authorize("admin"), deleteProject);

export default router;
