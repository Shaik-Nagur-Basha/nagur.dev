import express from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  updateProjectOrder,
  getExploreProjects,
} from "../controllers/projectController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.put("/order", protect, authorize("admin"), updateProjectOrder);

router
  .route("/")
  .get(getProjects)
  .post(protect, authorize("admin"), upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }]), createProject);

router.get("/:id/explore", getExploreProjects);

router
  .route("/:id")
  .get(getProject)
  .put(protect, authorize("admin"), upload.fields([{ name: "image", maxCount: 1 }, { name: "video", maxCount: 1 }]), updateProject)
  .delete(protect, authorize("admin"), deleteProject);

export default router;
