import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Profile from "../models/Profile.js";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from root
dotenv.config({ path: path.join(__dirname, "../../.env") });

const seedProfile = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI is not defined in env vars");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✓ MongoDB connected successfully");

    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      console.error("No admin user found. Please register an admin first.");
      process.exit(1);
    }
    console.log(`Using admin user: ${admin.email} (${admin._id})`);

    const filePath = path.join(__dirname, '../../frontend/public/data/profile.json');
    if (!fs.existsSync(filePath)) {
      console.error(`profile.json file not found at ${filePath}`);
      process.exit(1);
    }

    console.log("Reading profile.json...");
    const rawData = fs.readFileSync(filePath, "utf8");
    const parsedData = JSON.parse(rawData);

    if (!parsedData.success || !parsedData.data) {
      console.error("Invalid profile.json format. Expected { success: true, data: {...} }");
      process.exit(1);
    }

    const sanitizeId = (id) => {
      if (typeof id === "string") {
        if (id.length === 26 && id.startsWith("6a")) {
          id = id.substring(2);
        }
        if (id.length === 24) {
          return id.toLowerCase().split("").map(char => {
            if (/[0-9a-f]/.test(char)) {
              return char;
            }
            const code = char.charCodeAt(0);
            if (code >= 103 && code <= 118) { // 'g' to 'v'
              return (code - 103).toString(16);
            }
            return "0";
          }).join("");
        }
      }
      return id;
    };

    const sanitizeObject = (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      } else if (obj !== null && typeof obj === "object") {
        const newObj = {};
        for (const key of Object.keys(obj)) {
          if (key === "_id" || key === "createdBy") {
            newObj[key] = sanitizeId(obj[key]);
          } else {
            newObj[key] = sanitizeObject(obj[key]);
          }
        }
        return newObj;
      }
      return obj;
    };

    const profileData = sanitizeObject(parsedData.data);
    const profileId = profileData._id;

    if (!profileId) {
      console.error("Profile data lacks an _id field.");
      process.exit(1);
    }

    const preparedProfile = {
      name: profileData.name,
      title: profileData.title,
      bio: profileData.bio,
      cv: profileData.cv,
      profilePicture: profileData.profilePicture || "",
      socialLinks: profileData.socialLinks || {},
      location: profileData.location,
      phone: profileData.phone,
      availability: profileData.availability || "Available for projects",
      footerDescription: profileData.footerDescription,
      footerProjects: profileData.footerProjects || [],
      createdBy: admin._id,
    };

    // Find if a profile already exists
    // We search first by the profileId from json, then if not found, we see if there is ANY profile document
    let existingProfile = await Profile.findById(profileId);
    if (!existingProfile) {
      existingProfile = await Profile.findOne();
    }

    if (existingProfile) {
      console.log(`Profile document exists. Updating profile ID: ${existingProfile._id}...`);
      const updatedProfile = await Profile.findByIdAndUpdate(
        existingProfile._id,
        preparedProfile,
        { new: true, runValidators: true }
      );
      console.log("✓ Profile updated successfully!");
      // console.log("Updated Profile details:", JSON.stringify(updatedProfile, null, 2));
    } else {
      console.log(`No profile document exists. Creating new profile with ID: ${profileId}...`);
      const newProfile = await Profile.create({
        _id: profileId,
        ...preparedProfile
      });
      console.log("✓ Profile created and seeded successfully!");
      // console.log("Created Profile details:", JSON.stringify(newProfile, null, 2));
    }

    process.exit(0);
  } catch (error) {
    console.error("✗ Profile seeding failed:", error);
    process.exit(1);
  }
};

seedProfile();
