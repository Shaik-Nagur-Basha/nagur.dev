import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import Contact from "./models/Contact.js";
import { addContactToSheet } from "./services/googleSheets.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ MongoDB connected successfully");
  } catch (error) {
    console.error("✗ MongoDB connection error:", error.message);
    console.warn(
      "⚠ Backend running without database. Please configure MONGODB_URI in .env",
    );
  }
};

// Connect to database
connectDB();

const __dirname = path.resolve();

// Contact form submission endpoint
app.post("/api/contact", async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Create and save contact to MongoDB
    const contact = new Contact({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    await contact.save();

    // Also add to Google Sheet
    await addContactToSheet({
      name: contact.name,
      email: contact.email,
      message: contact.message,
      submittedAt: contact.submittedAt,
    });

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        message: contact.message,
        submittedAt: contact.submittedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get all contacts (for admin purposes)
// app.get("/api/contacts", async (req, res, next) => {
//   try {
//     const contacts = await Contact.find().sort({ submittedAt: -1 });
//     res.json(contacts);
//   } catch (error) {
//     next(error);
//   }
// });

// Health check endpoint
app.get("/api/health", async (req, res, next) => {
  try {
    const mongooseStatus = mongoose.connection.readyState;
    const dbConnected = mongooseStatus === 1;

    res.json({
      status: "Backend is running!",
      database: dbConnected ? "Connected to MongoDB" : "MongoDB not connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// Serve static files from frontend dist
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// SPA fallback - serve index.html for all non-API routes
app.get(/^(?!\/api\/)/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// 404 handler for unmatched API routes
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: message,
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API Base URL: http://localhost:${PORT}/api`);
  console.log(`\nEndpoints:`);
  console.log(`  POST   /api/contact    - Submit contact form`);
  console.log(`  GET    /api/contacts   - Get all submissions (admin)`);
  console.log(`  GET    /api/health     - Health check\n`);
});
