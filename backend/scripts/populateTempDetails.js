import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../models/Project.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const populateTempDetails = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI is not defined in env vars");
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for populating details on temp projects...');

    // Find all temp projects
    const tempProjects = await Project.find({ title: /Temp/i });
    console.log(`Found ${tempProjects.length} temp projects to update.`);

    const mockFeatures = [
      {
        title: "Responsive Interface",
        description: "Optimized for mobile, tablet, and desktop screens with seamless media breakpoints."
      },
      {
        title: "Enterprise Security",
        description: "Equipped with CORS configurations, input sanitization, and industry standard headers."
      },
      {
        title: "State Management",
        description: "Features global context stores ensuring fast component reactivity and state sync."
      }
    ];

    const mockGallery = [
      {
        url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80",
        caption: "Core system architecture and client workspace visualizer"
      },
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
        caption: "Interactive performance reporting metrics dashboard"
      }
    ];

    const mockTechStack = [
      {
        category: "Client Frameworks",
        items: ["React", "Vite", "Framer Motion", "Tailwind CSS"]
      },
      {
        category: "Data Services",
        items: ["MongoDB Atlas", "Express.js REST Api", "Node.js Platform", "Mongoose ODM"]
      }
    ];

    let updatedCount = 0;

    for (const p of tempProjects) {
      let updated = false;

      // Check featuresList
      if (!p.featuresList || p.featuresList.length === 0) {
        p.featuresList = mockFeatures;
        updated = true;
      }

      // Check gallery
      if (!p.gallery || p.gallery.length === 0) {
        p.gallery = mockGallery;
        updated = true;
      }

      // Check techStackDetails
      if (!p.techStackDetails || p.techStackDetails.length === 0) {
        p.techStackDetails = mockTechStack;
        updated = true;
      }

      if (updated) {
        await p.save({ validateBeforeSave: false });
        console.log(`Updated details for: "${p.title}"`);
        updatedCount++;
      }
    }

    console.log(`Completed populating temp details! Updated ${updatedCount} projects.`);
    process.exit(0);
  } catch (error) {
    console.error('Population failed:', error);
    process.exit(1);
  }
};

populateTempDetails();
