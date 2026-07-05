import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../models/Project.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const migrate = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI is not defined in env vars");
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for backfilling slugs and short descriptions...');

    const projects = await Project.find();
    console.log(`Found ${projects.length} projects to check.`);

    let updatedCount = 0;

    for (const p of projects) {
      let needsUpdate = false;

      if (!p.slug) {
        // Generate a clean slug from title
        let baseSlug = p.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
        
        // Ensure slug uniqueness
        let slug = baseSlug;
        let counter = 1;
        while (await Project.findOne({ slug, _id: { $ne: p._id } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        p.slug = slug;
        needsUpdate = true;
      }

      if (!p.shortDescription) {
        // Take first sentence or first 100 characters of description
        let desc = p.description || "";
        let sentenceEnd = desc.indexOf(".");
        let shortDesc = "";
        if (sentenceEnd !== -1 && sentenceEnd < 120) {
          shortDesc = desc.substring(0, sentenceEnd + 1).trim();
        } else {
          shortDesc = desc.substring(0, 100).trim();
          if (desc.length > 100) shortDesc += "...";
        }
        p.shortDescription = shortDesc || "A modern showcase project.";
        needsUpdate = true;
      }

      // Also ensure at least one media is present (image or video)
      if (!p.image && !p.video) {
        p.image = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80";
        p.mediaType = "image";
        needsUpdate = true;
      }

      if (needsUpdate) {
        await p.save({ validateBeforeSave: false });
        console.log(`Updated project "${p.title}" with slug: "${p.slug}", shortDescription: "${p.shortDescription}"`);
        updatedCount++;
      }
    }

    console.log(`Migration complete! Updated ${updatedCount} projects.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
