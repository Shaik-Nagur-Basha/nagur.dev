import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsFilePath = path.join(__dirname, "../public/data/projects.json");
const sitemapFilePath = path.join(__dirname, "../public/sitemap.xml");
const indexHtmlPath = path.join(__dirname, "../index.html");

const escapeXml = (str) => {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

const mainPages = [
  { path: "", priority: "1.0", changefreq: "daily" },
  { path: "projects", priority: "0.9", changefreq: "daily" },
  { path: "privacy", priority: "0.3", changefreq: "monthly" },
  { path: "terms", priority: "0.3", changefreq: "monthly" },
  { path: "cookies", priority: "0.3", changefreq: "monthly" },
];

const generateSitemapAndIndexHtml = () => {
  try {
    console.log("Generating sitemap.xml & updating index.html with ALL projects...");

    if (!fs.existsSync(projectsFilePath)) {
      console.warn("⚠️ projects.json not found.");
    }

    const projectsData = fs.existsSync(projectsFilePath)
      ? JSON.parse(fs.readFileSync(projectsFilePath, "utf8"))
      : { success: true, data: [] };

    const projects = Array.isArray(projectsData.data) ? projectsData.data : [];

    // 1. Build sitemap.xml
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <!-- Main Pages -->
`;

    mainPages.forEach((p) => {
      xml += `  <url>
    <loc>https://nagur-dev.web.app/${p.path}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>\n`;
    });

    if (projects.length > 0) {
      xml += `\n  <!-- Dynamic Project Pages with Images & Videos -->\n`;
      projects.forEach((proj) => {
        const slug = proj.slug || proj._id;
        if (!slug) return;

        const title = escapeXml(proj.title || "Project Details");
        const rawDesc = (proj.shortDescription || proj.description || "").replace(/<[^>]*>/g, "");
        const description = escapeXml(rawDesc.substring(0, 200));

        xml += `  <url>\n`;
        xml += `    <loc>https://nagur-dev.web.app/projects/${slug}</loc>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;

        if (proj.image) {
          xml += `    <image:image>\n`;
          xml += `      <image:loc>${escapeXml(proj.image)}</image:loc>\n`;
          xml += `      <image:title>${title} Screenshot</image:title>\n`;
          xml += `      <image:caption>${description}</image:caption>\n`;
          xml += `    </image:image>\n`;
        }

        if (Array.isArray(proj.gallery)) {
          proj.gallery.forEach((gImg, idx) => {
            const gUrl = typeof gImg === "string" ? gImg : gImg?.url;
            if (gUrl && gUrl !== proj.image) {
              xml += `    <image:image>\n`;
              xml += `      <image:loc>${escapeXml(gUrl)}</image:loc>\n`;
              xml += `      <image:title>${title} Gallery Image ${idx + 1}</image:title>\n`;
              xml += `      <image:caption>${description}</image:caption>\n`;
              xml += `    </image:image>\n`;
            }
          });
        }

        if (proj.video) {
          const pubDate = proj.createdAt ? new Date(proj.createdAt).toISOString() : new Date().toISOString();
          xml += `    <video:video>\n`;
          xml += `      <video:thumbnail_loc>${escapeXml(proj.image || "https://nagur-dev.web.app/nagur_photo.png")}</video:thumbnail_loc>\n`;
          xml += `      <video:title>${title} Demo Video</video:title>\n`;
          xml += `      <video:description>${description}</video:description>\n`;
          xml += `      <video:content_loc>${escapeXml(proj.video)}</video:content_loc>\n`;
          xml += `      <video:publication_date>${pubDate}</video:publication_date>\n`;
          xml += `    </video:video>\n`;
        }

        xml += `  </url>\n`;
      });
    }

    xml += `</urlset>\n`;

    fs.writeFileSync(sitemapFilePath, xml, "utf8");
    console.log(`✓ Successfully generated sitemap.xml with ${projects.length} projects!`);

    // 2. Update index.html noscript block with ALL projects
    if (fs.existsSync(indexHtmlPath)) {
      let indexHtml = fs.readFileSync(indexHtmlPath, "utf8");

      let noscriptContent = `    <noscript>\n`;
      noscriptContent += `      <div style="padding: 20px; font-family: sans-serif;">\n`;
      noscriptContent += `        <h2>nagur.dev | Sk Nagur Basha - Portfolio</h2>\n`;
      noscriptContent += `        <p>Full Stack Web Developer specializing in React, Node.js, and modern web applications.</p>\n`;
      noscriptContent += `        <ul>\n`;
      noscriptContent += `          <li><a href="https://nagur-dev.web.app/">Home</a></li>\n`;
      noscriptContent += `          <li><a href="https://nagur-dev.web.app/projects">All Projects</a></li>\n`;

      projects.forEach((proj) => {
        const slug = proj.slug || proj._id;
        if (slug) {
          noscriptContent += `          <li><a href="https://nagur-dev.web.app/projects/${slug}">${escapeXml(proj.title)}</a></li>\n`;
        }
      });

      noscriptContent += `          <li><a href="https://nagur-dev.web.app/privacy">Privacy Policy</a></li>\n`;
      noscriptContent += `          <li><a href="https://nagur-dev.web.app/terms">Terms of Service</a></li>\n`;
      noscriptContent += `          <li><a href="https://nagur-dev.web.app/cookies">Cookie Policy</a></li>\n`;
      noscriptContent += `        </ul>\n`;
      noscriptContent += `      </div>\n`;
      noscriptContent += `    </noscript>`;

      indexHtml = indexHtml.replace(/<noscript>[\s\S]*?<\/noscript>/, noscriptContent);
      fs.writeFileSync(indexHtmlPath, indexHtml, "utf8");
      console.log(`✓ Successfully updated index.html <noscript> block with all ${projects.length} projects!`);
    }

  } catch (error) {
    console.error("✗ Failed to generate sitemap or update index.html:", error);
    process.exit(1);
  }
};

generateSitemapAndIndexHtml();
