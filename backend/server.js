require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const voiceRoutes = require("./routes/voiceRoutes");
const app = express();

/* -------------------- Environment Check -------------------- */
if (!process.env.DEEPGRAM_API_KEY) {
  console.warn("⚠️  WARNING: DEEPGRAM_API_KEY is not set. Voice transcription will fail.");
} else {
  console.log("✓ DEEPGRAM_API_KEY is configured");
}

/* -------------------- Database Connection -------------------- */
connectDB();

/* -------------------- Middleware -------------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));


/* -------------------- Routes -------------------- */

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "SmartVegies Backend Running" });
});

// Voice API Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is healthy",
    timestamp: new Date().toISOString(),
    deepgram: process.env.DEEPGRAM_API_KEY ? "✓ Configured" : "✗ Not configured",
  });
});

// Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/trace", require("./routes/traceRoutes"));


/* -------------------- Server -------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Node Environment: ${process.env.NODE_ENV || "development"}`);
});
