# 🚀 Release v2.5.0 — The Ultimate MERN Showcase Update

## 📋 Release Notes

Welcome to **v2.5.0** of `nagur.dev`! This release elevates the platform into a production-grade developer showcase and fully dynamic Content Management System (CMS).

### 🌟 Highlights
- **⚡ Tailwind CSS v4 Migration**: Upgraded frontend styling layers with the latest Tailwind CSS v4 compiler for sub-millisecond build times.
- **🎨 Custom System Theme Customizer**: Administrators can now update background patterns, layout themes, and color options from the CMS.
- **📁 Multi-Format Project Showcases**: Support for autoplay looping videos, customized gallery showcases, and automated thumbnail fallbacks.
- **💬 Enhanced Inbox Manager**: Streamlined contact submission status tracking (New, Read, Replied) with bulk actions.
- **🛡️ Next-Gen Security Core**: Integrated Argon2 credentials, secure JWT HttpOnly cookies, rate limits, CSP headers via Helmet, and anti-NoSQL injection/XSS protection.

---

## 🛠️ Detailed Changelog

### 💻 Frontend
- **Upgraded** to Tailwind CSS v4 (`@tailwindcss/vite`).
- **Refactored** routing with dynamic SEO controls (`PageHeadController`) to update meta tags, document title, and favicons dynamically.
- **Optimized** state management with Zustand stores (`useAuthStore`, `useProfileStore`, `useAdminStore`).
- **Added** Framer Motion micro-animations, loading skeletons (`SkeletonWaveBar`), and layout transitions.

### ⚙️ Backend
- **Implemented** secure Argon2 hashing for credentials management.
- **Enhanced** Express security middleware: `helmet`, `express-mongo-sanitize`, `xss-clean`, `hpp`, and `express-rate-limit`.
- **Integrated** Cloudinary API with Multer for handling seamless multi-media project asset uploads.
- **Configured** cross-origin configurations (CORS) with support for credentials.

### 💾 Database & Storage
- **Optimized** Mongoose schemas for Projects, Contacts, Profile, and Users.
- **Implemented** dynamic case-study fields (problemSolved, architectural decisions, challenges, learnings).
