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
import profileRoutes from "./routes/profileRoutes.js";

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
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        "img-src": ["'self'", "data:", "https://res.cloudinary.com", "https://*.cloudinary.com"],
        "media-src": ["'self'", "https://res.cloudinary.com", "https://*.cloudinary.com"],
        "font-src": ["'self'", "https://fonts.gstatic.com"],
        "connect-src": [
          "'self'", 
          "https://nagur-dev.onrender.com", 
          "https://www.nagur-dev.onrender.com",
          ...(process.env.NODE_ENV !== "production" ? ["http://localhost:*", "ws://localhost:*"] : [])
        ],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
// app.use(mongoSanitize()); // Prevent NoSQL injection
// app.use(xss()); // Prevent XSS attacks
// app.use(hpp()); // Prevent HTTP Parameter Pollution

// CORS Configuration
const allowedOrigins = [
  "https://nagur-dev.onrender.com",
  "https://www.nagur-dev.onrender.com",
  ...(process.env.NODE_ENV !== "production" ? ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"] : [])
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
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
app.use("/api/profile", profileRoutes);

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
const distPath = path.resolve(rootDir, "frontend", "dist");
app.use(express.static(distPath));

// SPA fallback - should be the last route
app.use((req, res, next) => {
  // Skip API routes
  if (req.url.startsWith("/api/")) {
    return next();
  }

  // If the request looks like a file (has an extension), but wasn't found by express.static
  // Return a 404 instead of serving index.html to avoid MIME type errors
  if (path.extname(req.url)) {
    return res.status(404).json({
      success: false,
      message: `Asset not found: ${req.url}`,
    });
  }

  const indexPath = path.join(distPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("Error sending index.html:", err);
      // In production, send a cleaner error or a fallback
      res.status(404).send("Frontend build files not found. Please ensure the project is built correctly.");
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
