import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import Contact from "./models/Contact.js";
import Theme from "./models/Theme.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
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
    // Continue running with warning
    console.warn(
      "⚠ Backend running without database. Please configure MONGODB_URI in .env",
    );
  }
};

// Connect to database
connectDB();

// Contact form submission endpoint
app.post("/api/contact", async (req, res) => {
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
    console.error("Error submitting contact form:", error);
    res.status(500).json({ error: "Failed to submit contact form" });
  }
});

// Get all contacts (for admin purposes - add authentication in production)
app.get("/api/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ submittedAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

// Save theme preference endpoint
app.post("/api/theme", async (req, res) => {
  try {
    const { darkMode } = req.body;
    const sessionId = req.cookies.sessionId || Date.now().toString();

    // Set cookie with 30-day expiry
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const expiresDate = new Date(Date.now() + thirtyDaysInMs);

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: thirtyDaysInMs,
    });

    // Update or create theme preference in MongoDB
    await Theme.findOneAndUpdate(
      { sessionId },
      {
        sessionId,
        darkMode: darkMode === true || darkMode === "true",
        lastUpdated: new Date(),
        expiresAt: expiresDate,
      },
      { upsert: true, new: true },
    );

    res.json({
      success: true,
      message: "Theme preference saved",
      sessionId,
      darkMode: darkMode === true || darkMode === "true",
    });
  } catch (error) {
    console.error("Error saving theme preference:", error);
    res.status(500).json({ error: "Failed to save theme preference" });
  }
});

// Get theme preference endpoint
app.get("/api/theme", async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      return res.json({
        darkMode: null,
        sessionId: null,
      });
    }

    const themeData = await Theme.findOne({ sessionId });

    if (!themeData) {
      return res.json({
        darkMode: null,
        sessionId,
      });
    }

    res.json({
      success: true,
      darkMode: themeData.darkMode,
      sessionId,
    });
  } catch (error) {
    console.error("Error fetching theme preference:", error);
    res.status(500).json({ error: "Failed to fetch theme preference" });
  }
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    const mongooseStatus = mongoose.connection.readyState;
    const dbConnected = mongooseStatus === 1;

    res.json({
      status: "Backend is running!",
      database: dbConnected ? "Connected to MongoDB" : "MongoDB not connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.json({
      status: "Backend is running!",
      database: "Error checking database status",
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API Base URL: http://localhost:${PORT}/api`);
  console.log(`\nEndpoints:`);
  console.log(`  POST   /api/contact    - Submit contact form`);
  console.log(`  GET    /api/contacts   - Get all submissions (admin)`);
  console.log(`  POST   /api/theme      - Save theme preference`);
  console.log(`  GET    /api/theme      - Get theme preference`);
  console.log(`  GET    /api/health     - Health check\n`);
});
