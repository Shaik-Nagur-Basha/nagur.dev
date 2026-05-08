import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import helmet from "helmet";
import path from "path";

// Route files
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

// Middleware
import { errorHandler } from "./middleware/errorMiddleware.js";

// Load env vars
dotenv.config();

const app = express();
app.set("trust proxy", 1); // Trust first proxy (useful for Vercel/Cloudflare)
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
  })
);
// app.use(mongoSanitize()); // Prevent NoSQL injection
// app.use(xss()); // Prevent XSS attacks
// app.use(hpp()); // Prevent HTTP Parameter Pollution

// CORS Configuration
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? "https://nagur.dev" 
      : ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ MongoDB connected successfully");
  } catch (error) {
    console.error("✗ MongoDB connection error:", error.message);
  }
};

// Connect to database
connectDB();

const __dirname = path.resolve();

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contacts", contactRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "Backend is running!",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Not Connected",
    timestamp: new Date().toISOString(),
  });
});

// Serve static files from frontend dist
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// SPA fallback
app.get(/^(?!\/api\/)/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`);
});
