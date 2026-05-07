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

const projectsToMigrate = [
  {
    title: "BlogByte Blog",
    description: "Full-stack blogging platform with post creation, comments, authentication, and modern UI.",
    tags: ["React", "Node.js", "Express", "MongoDB"],
    link: "https://blogbyte-blog.onrender.com",
    github: "https://github.com/Shaik-Nagur-Basha/BlogByte-Blog",
    video: "https://res.cloudinary.com/dn2jspecc/video/upload/v1769023123/Blogbyte-Blog_twspq4.mp4",
  },
  {
    title: "Listing Hub",
    description: "Full-stack listing platform built using RESTful APIs and MVC architecture.",
    tags: ["React", "Node.js", "Express", "MongoDB", "REST API"],
    link: "https://listing-hub.onrender.com",
    github: "https://github.com/Shaik-Nagur-Basha/Listing-Hub",
    video: "https://res.cloudinary.com/dn2jspecc/video/upload/v1769023142/Listing-Hub_z3cxqu.mp4",
  },
  {
    title: "Gradient Craft",
    description: "Interactive gradient generator tool with live preview and copy-ready CSS output.",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "https://shaik-nagur-basha.github.io/Gradient-Craft",
    github: "https://github.com/Shaik-Nagur-Basha/Gradient-Craft",
    video: "https://res.cloudinary.com/dn2jspecc/video/upload/v1769021732/Gradient-Craft_lkzjpk.mp4",
  },
  {
    title: "DevMatrix (Ongoing)",
    description: "Developer-focused platform showcasing tools, utilities, and productivity features.",
    tags: ["React", "Tailwind CSS", "JavaScript"],
    link: "https://shaik-nagur-basha.github.io/DevMatrix",
    github: "https://github.com/Shaik-Nagur-Basha/DevMatrix",
    video: "https://res.cloudinary.com/dn2jspecc/video/upload/v1769021718/DevMatrix_zngwlj.mp4",
  },
  {
    title: "NeoChat (Ongoing)",
    description: "Real-time chat application with users, groups, channels, and message persistence.",
    tags: ["React", "Node.js", "Socket.io", "MongoDB"],
    link: "https://neochat-sk.onrender.com",
    github: "https://github.com/Shaik-Nagur-Basha/NeoChat",
    video: "https://res.cloudinary.com/dn2jspecc/video/upload/v1769023132/NeoChat_d6tcg7.mp4",
  },
  {
    title: "Spotify Home UI Clone",
    description: "Pixel-perfect Spotify home interface clone with responsive and modern layout.",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "https://shaik-nagur-basha.github.io/Spotify-Home-UI-Clone",
    github: "https://github.com/Shaik-Nagur-Basha/Spotify-Home-UI-Clone",
    video: "https://res.cloudinary.com/dn2jspecc/video/upload/v1769019956/Spotify-Home_cdmuj7.mp4",
  },
  {
    title: "StellarMarket (Ongoing)",
    description: "Modern e-commerce UI with product listings, filters, and clean UX patterns.",
    tags: ["React", "Tailwind CSS", "JavaScript"],
    link: "https://shaik-nagur-basha.github.io/StellarMarket",
    github: "https://github.com/Shaik-Nagur-Basha/StellarMarket",
    video: "https://res.cloudinary.com/dn2jspecc/video/upload/w_1280,h_720/v1769022237/StellarMarket_y7tab1.mp4",
  },
  {
    title: "SyncTask (Ongoing)",
    description: "Task management application focused on productivity and clean user experience.",
    tags: ["React", "JavaScript", "Tailwind CSS"],
    link: "https://shaik-nagur-basha.github.io/SyncTask",
    github: "https://github.com/Shaik-Nagur-Basha/SyncTask",
    video: "https://res.cloudinary.com/dn2jspecc/video/upload/v1769019970/SyncTask_g7nsdf.mp4",
  },
  {
    title: "Text In Image Generator",
    description: "Utility tool to generate styled text embedded inside images dynamically.",
    tags: ["HTML", "CSS", "JavaScript"],
    link: "https://shaik-nagur-basha.github.io/Text-In-Image",
    github: "https://github.com/Shaik-Nagur-Basha/Text-In-Image",
    video: "https://res.cloudinary.com/dn2jspecc/video/upload/v1769021713/Text-In-Image_f3g0hw.mp4",
  },
];

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for migration...');

    const admin = await User.findOne();
    if (!admin) {
      console.error('No admin user found. Please register an admin first.');
      process.exit(1);
    }

    console.log(`Using admin user: ${admin.email} (${admin._id})`);

    for (const p of projectsToMigrate) {
      // Check if project already exists to avoid duplicates
      const exists = await Project.findOne({ title: p.title });
      if (exists) {
        console.log(`Project "${p.title}" already exists, skipping.`);
        continue;
      }

      const newProject = await Project.create({
        title: p.title,
        description: p.description,
        mediaType: 'video',
        video: p.video,
        skills: p.tags,
        githubLink: p.github,
        demoLink: p.link,
        category: 'Full Stack', // Default category
        status: 'Published',
        featured: true,
        createdBy: admin._id,
      });

      // Add to user projects
      await User.findByIdAndUpdate(admin._id, {
        $push: { projects: newProject._id },
      });

      console.log(`Migrated: ${p.title}`);
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
