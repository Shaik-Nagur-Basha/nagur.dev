import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "../models/Project.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const printId = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const project = await Project.findOne({ title: "BlogByte Blog" });
    if (project) {
      console.log("PROJECT_ID:", project._id.toString());
    } else {
      console.log("Project not found.");
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

printId();
