import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../models/Project.js';
import User from '../models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedTemp = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI is not defined in env vars");
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding temp projects...');

    const originalProjects = await Project.find({ title: { $not: /Temp/i } });
    console.log(`Found ${originalProjects.length} original projects to clone.`);

    let clonedCount = 0;

    const categories = ["Frontend", "Backend", "Full Stack", ""];
    const githubLinks = ["https://github.com/temp-project-repo", ""];
    const demoLinks = ["https://temp-project-demo.com", ""];
    const featuredOptions = [true, false];
    const statusOptions = ["Draft", "Published"];

    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

    for (const p of originalProjects) {
      const tempTitle = `${p.title} (Temp)`;
      
      // Check if this temp project already exists
      const exists = await Project.findOne({ title: tempTitle });
      if (exists) {
        console.log(`Temp project for "${p.title}" already exists, skipping.`);
        continue;
      }

      // Generate a unique slug
      let baseSlug = `${p.slug}-temp`;
      let slug = baseSlug;
      let counter = 1;
      while (await Project.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Prepare temp values
      const category = getRandomElement(categories);
      const githubLink = getRandomElement(githubLinks);
      const demoLink = getRandomElement(demoLinks);
      const featured = getRandomElement(featuredOptions);
      const status = getRandomElement(statusOptions);

      // Create new project document
      const tempProject = await Project.create({
        title: tempTitle,
        slug: slug,
        shortDescription: p.shortDescription || "A temporary demo project.",
        description: p.description,
        mediaType: p.mediaType,
        image: p.image,
        imagePublicId: p.imagePublicId,
        video: p.video,
        videoPublicId: p.videoPublicId,
        skills: p.skills,
        githubLink: githubLink,
        demoLink: demoLink,
        category: category,
        featured: featured,
        status: status,
        createdBy: p.createdBy,
        featuresList: p.featuresList || [],
        gallery: p.gallery || [],
        techStackDetails: p.techStackDetails || [],
      });

      // Update creator's projects list
      if (p.createdBy) {
        await User.findByIdAndUpdate(p.createdBy, {
          $push: { projects: tempProject._id },
        });
      }

      console.log(`Created temp project: "${tempProject.title}"`);
      console.log(`  - Slug: "${tempProject.slug}"`);
      console.log(`  - Category: "${category}"`);
      console.log(`  - GitHub: "${githubLink}"`);
      console.log(`  - Demo: "${demoLink}"`);
      console.log(`  - Featured: ${featured}`);
      console.log(`  - Status: "${status}"`);
      clonedCount++;
    }

    console.log(`Seeding complete! Cloned ${clonedCount} projects.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedTemp();
