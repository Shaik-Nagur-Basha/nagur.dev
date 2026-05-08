import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

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
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  }),
);
// app.use(mongoSanitize()); // Prevent NoSQL injection
// app.use(xss()); // Prevent XSS attacks
// app.use(hpp()); // Prevent HTTP Parameter Pollution

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins =
      process.env.NODE_ENV === "production"
        ? [
            "https://nagur-dev.onrender.com",
            "https://www.nagur-dev.onrender.com",
          ]
        : [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
          ];

    // Allow requests with no origin (mobile apps, curl requests, internal requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/contacts", contactRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "Backend is running!",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Not Connected",
    timestamp: new Date().toISOString(),
  });
});

// Serve static files from frontend dist
const distPath = path.join(rootDir, "frontend", "dist");
app.use(express.static(distPath));

// SPA fallback - should be the last route
app.use((req, res, next) => {
  // Skip API routes
  if (req.url.startsWith("/api/")) {
    return next();
  }

  const indexPath = path.join(distPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("Error sending index.html:", err);
      res.status(404).json({
        success: false,
        error:
          "Frontend build files not found. Please ensure the project is built correctly.",
        path: indexPath,
      });
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(
    `\n🚀 Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`,
  );
});
