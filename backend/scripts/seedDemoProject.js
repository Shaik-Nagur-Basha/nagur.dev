import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "../models/Project.js";
import User from "../models/User.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const seedDemo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding demo project fields...");

    const admin = await User.findOne();
    if (!admin) {
      console.error("No admin user found. Please register an admin first.");
      process.exit(1);
    }

    const title = "BlogByte Blog";
    const demoData = {
      title,
      description: "An ultra-premium, full-stack blogging platform delivering high-performance content delivery, modern state-management, and seamless responsive design mimicking Vercel's precision interfaces.",
      mediaType: "video",
      video: "https://res.cloudinary.com/dn2jspecc/video/upload/v1769023123/Blogbyte-Blog_twspq4.mp4",
      skills: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "JWT Auth"],
      githubLink: "https://github.com/Shaik-Nagur-Basha/BlogByte-Blog",
      demoLink: "https://blogbyte-blog.onrender.com",
      category: "Full Stack",
      featured: true,
      status: "Published",
      createdBy: admin._id,
      
      // Selected Premium Fields
      featuresList: [
        {
          title: "Intelligent Rich Editor",
          description: "A gorgeous Notion-like drag-and-drop text editor supporting markdown exports and instant media uploading.",
        },
        {
          title: "Real-time Interactive Comments",
          description: "Nested comments threads powered by web sockets, featuring markdown syntax support and likes.",
        },
        {
          title: "JWT Authentication & Session Guarding",
          description: "High-grade authorization middleware protecting user panels, profiles, and write APIs with token validation.",
        },
        {
          title: "Cloudinary-Powered Media Pipeline",
          description: "Every image and video uploaded by authors is automatically processed, optimised, and delivered through Cloudinary's global CDN — ensuring sub-200ms load times, adaptive quality, and on-the-fly transformations like cropping, resizing, and format conversion without a single byte of storage on the application server.",
        },
        {
          title: "Redux Toolkit Global State Architecture",
          description: "The entire client-side data layer is orchestrated with Redux Toolkit, enabling a single source of truth across authentication state, post feeds, comment trees, and user preferences. Slice-based reducers, async thunks, and selector memoisation keep UI updates surgical and re-renders minimal even as data volume scales.",
        },
        {
          title: "Server-Side Pagination & Infinite Scroll Feed",
          description: "Post feeds are delivered in cursor-based paginated batches from the Express API, stitched client-side into a silky-smooth infinite scroll experience. Each batch is preloaded on the trailing edge of the viewport so readers never see a loading spinner mid-article — combining the performance of SSR patterns with the interactivity of a single-page application.",
        },
      ],
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=1200&q=80",
          caption: "Writing Desk Interface - Notion-like drag-and-drop workspace layout"
        },
        {
          url: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=80",
          caption: "Live Interactive Dashboard - View counts and comment analytics charts"
        },
        {
          url: "https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&w=1200&q=80",
          caption: "Authentication Flow - Secure JWT login and session management screens"
        },
        {
          url: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=1200&q=80",
          caption: "Developer API Console - RESTful endpoint explorer with live request testing"
        },
        {
          url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80",
          caption: "Mobile Responsive View - Adaptive layout across all screen breakpoints"
        },
        {
          url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
          caption: "Analytics Overview - Real-time traffic insights and engagement metrics"
        },
        {
          url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
          caption: "Collaborative Workspace - Multi-user editing with live presence indicators"
        },
        {
          url: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=1200&q=80",
          caption: "Dark Mode UI - Meticulously crafted dark theme for low-light environments"
        }
      ],
      techStackDetails: [
        {
          category: "Frontend Architecture",
          items: ["React.js", "Tailwind CSS", "Redux Toolkit", "Framer Motion", "Zod Validation"]
        },
        {
          category: "Backend Services",
          items: ["Node.js", "Express.js", "MongoDB (Mongoose)"]
        },
        {
          category: "DevOps & Infrastructure",
          items: ["Docker", "GitHub Actions CI/CD", "Render Cloud Hosting", "Cloudflare CDN", "Vite Bundler"]
        },
        {
          category: "Security & Optimization",
          items: ["JWT Auth Guard", "Express Rate Limiter", "Helmet Security Headers", "CORS Configuration"]
        },
        {
          category: "Testing & Quality Assurance",
          items: ["Jest Framework", "Supertest API Mocking", "ESLint & Prettier Linting", "Postman Documentation", "Chrome DevTools Audit"]
        }
      ]
    };

    let project = await Project.findOne({ title });
    if (project) {
      // Update existing project to include premium details
      project = await Project.findByIdAndUpdate(project._id, demoData, { new: true });
      console.log(`Updated existing project "${title}" with premium details!`);
    } else {
      // Create new one
      project = await Project.create(demoData);
      console.log(`Created new project "${title}" with premium details!`);
      await User.findByIdAndUpdate(admin._id, { $push: { projects: project._id } });
    }

    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDemo();
