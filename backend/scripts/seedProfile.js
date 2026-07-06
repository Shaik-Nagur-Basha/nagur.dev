import mongoose from "mongoose";
import dotenv from "dotenv";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const seedProfile = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI is not defined in env vars");
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected for seeding profile...");

    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      console.error("No admin user found. Please register an admin user first.");
      process.exit(1);
    }

    const profileData = {
      name: "Sk Nagur Basha",
      title: "MERN Stack Developer",
      bio: "MERN full stack web developer focused on building fast, accessible, and visually refined web experiences with modern technologies.",
      cv: "https://drive.google.com/uc?export=download&id=1P3IEWXQhUUf6H2VGg1VjRFOOVBrS4DfV",
      profilePicture: "",
      location: "Badvel, Kadapa, Andhra Pradesh, 516227",
      phone: "+91 6302504034",
      availability: "Available for projects",
      socialLinks: {
        github: "https://github.com/Shaik-Nagur-Basha",
        linkedin: "https://www.linkedin.com/in/nagur-basha",
        telegram: "https://t.me/sknba",
        email: "sknbasknba@gmail.com",
      },
      footerDescription: "MERN full stack web developer focused on building fast, accessible, and visually refined web experiences with modern technologies.",
      footerProjects: [
        { label: "BlogByte Blog", link: "https://blogbyte-blog.onrender.com" },
        { label: "Gradient Craft", link: "https://shaik-nagur-basha.github.io/Gradient-Craft" },
        { label: "DevMatrix", link: "https://shaik-nagur-basha.github.io/DevMatrix" },
        { label: "NeoChat", link: "https://neochat-sk.onrender.com" },
      ],
      createdBy: admin._id,
    };

    let profile = await Profile.findOne();
    if (profile) {
      // Update existing profile
      profile = await Profile.findByIdAndUpdate(
        profile._id,
        {
          $set: {
            footerDescription: profileData.footerDescription,
            footerProjects: profileData.footerProjects,
          },
        },
        { new: true, runValidators: true }
      );
      console.log("Profile updated successfully with footer details!");
    } else {
      // Create new profile
      profile = await Profile.create(profileData);
      console.log("Profile created and seeded successfully!");
    }

    console.log("Seeded Profile data:", JSON.stringify(profile, null, 2));
    process.exit(0);
  } catch (error) {
    console.error("Profile seeding failed:", error);
    process.exit(1);
  }
};

seedProfile();
