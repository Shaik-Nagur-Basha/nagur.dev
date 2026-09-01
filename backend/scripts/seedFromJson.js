import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Project from '../models/Project.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedFromJson = async () => {
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

    const filePath = path.join(__dirname, '../../frontend/public/data/projects.json');
    if (!fs.existsSync(filePath)) {
      console.error(`projects.json file not found at ${filePath}`);
      process.exit(1);
    }

    console.log("Reading projects.json...");
    const rawData = fs.readFileSync(filePath, 'utf8');
    const parsedData = JSON.parse(rawData);
    
    if (!parsedData.success || !Array.isArray(parsedData.data)) {
      console.error("Invalid projects.json format. Expected { success: true, data: [...] }");
      process.exit(1);
    }

    const sanitizeId = (id) => {
      if (typeof id === 'string') {
        if (id.length === 26 && id.startsWith('6a')) {
          id = id.substring(2);
        }
        if (id.length === 24) {
          return id.toLowerCase().split('').map(char => {
            if (/[0-9a-f]/.test(char)) {
              return char;
            }
            const code = char.charCodeAt(0);
            if (code >= 103 && code <= 118) { // 'g' to 'v'
              return (code - 103).toString(16);
            }
            return '0';
          }).join('');
        }
      }
      return id;
    };

    const sanitizeObject = (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      } else if (obj !== null && typeof obj === 'object') {
        const newObj = {};
        for (const key of Object.keys(obj)) {
          if (key === '_id' || key === 'createdBy') {
            newObj[key] = sanitizeId(obj[key]);
          } else {
            newObj[key] = sanitizeObject(obj[key]);
          }
        }
        return newObj;
      }
      return obj;
    };

    const projects = sanitizeObject(parsedData.data);
    console.log(`Found ${projects.length} projects in projects.json to seed/update.`);

    let createdCount = 0;
    let updatedCount = 0;

    for (const p of projects) {
      if (!p._id) {
        console.warn(`Skipping project "${p.title}" because it lacks an _id.`);
        continue;
      }

      // Check if project exists by _id
      const exists = await Project.findById(p._id);

      const projectData = {
        title: p.title,
        slug: p.slug,
        shortDescription: p.shortDescription || "No short description provided.",
        description: p.description || "No description provided.",
        mediaType: p.mediaType || "video",
        image: p.image || null,
        video: p.video || null,
        skills: p.skills || [],
        githubLink: p.githubLink || "",
        demoLink: p.demoLink || "",
        category: p.category || "",
        featured: p.featured ?? false,
        status: p.status || "Published",
        order: p.order ?? 0,
        featuresList: p.featuresList || [],
        gallery: p.gallery || [],
        techStackDetails: p.techStackDetails || [],
        createdBy: admin._id,
      };

      if (exists) {
        // Update existing project
        await Project.findByIdAndUpdate(p._id, projectData, { runValidators: true });
        console.log(`✓ Updated: "${p.title}" (${p._id})`);
        updatedCount++;
      } else {
        // Create new project with specific _id
        await Project.create({
          _id: p._id,
          ...projectData
        });
        console.log(`✓ Created: "${p.title}" (${p._id})`);
        createdCount++;
      }

      // Ensure the project ID is in the admin user's projects array
      await User.findByIdAndUpdate(admin._id, {
        $addToSet: { projects: p._id }
      });
    }

    console.log(`\nSeeding completed successfully!`);
    console.log(`Created: ${createdCount} projects`);
    console.log(`Updated: ${updatedCount} projects`);
    process.exit(0);
  } catch (error) {
    console.error("✗ Seeding failed:", error);
    process.exit(1);
  }
};

seedFromJson();
