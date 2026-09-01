import mongoose from "mongoose";
import dotenv from "dotenv";
import Profile from "../models/Profile.js";
import Project from "../models/Project.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const downloadData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI is not defined in env vars");
      process.exit(1);
    }
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✓ MongoDB connected successfully");

    // Fetch Profile
    const profile = await Profile.findOne().lean();
    if (profile) {
      // Remove sensitive or unnecessary fields for public static display
      delete profile.createdBy;
      delete profile.__v;
    }

    // Fetch Projects (Only Published ones, or all depending on status)
    const projects = await Project.find({ status: "Published" })
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .lean();

    projects.forEach(project => {
      delete project.imagePublicId;
      delete project.videoPublicId;
      delete project.createdBy;
      delete project.__v;
    });

    const outputDir = path.join(__dirname, "../../frontend/public/data");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(outputDir, "profile.json"),
      JSON.stringify({ success: true, data: profile }, null, 2)
    );
    console.log(`✓ Profile data saved to ${path.join(outputDir, "profile.json")}`);

    fs.writeFileSync(
      path.join(outputDir, "projects.json"),
      JSON.stringify({ success: true, data: projects }, null, 2)
    );
    console.log(`✓ Projects data saved to ${path.join(outputDir, "projects.json")}`);

    process.exit(0);
  } catch (error) {
    console.error("✗ Data download failed:", error);
    process.exit(1);
  }
};

downloadData();
