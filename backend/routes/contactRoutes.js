import express from "express";
import {
  submitContact,
  getContacts,
  updateContactStatus,
  deleteContact,
} from "../controllers/contactController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(submitContact)
  .get(protect, authorize("admin"), getContacts);

router
  .route("/:id")
  .put(protect, authorize("admin"), updateContactStatus)
  .delete(protect, authorize("admin"), deleteContact);

export default router;
