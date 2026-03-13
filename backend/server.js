require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const app = express();

/* -------------------- Database Connection -------------------- */
connectDB();

/* -------------------- Middleware -------------------- */
app.use(cors());
app.use(express.json());

/* -------------------- Routes -------------------- */

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "SmartVegies Backend Running" });
});

// Auth Routes
app.use("/api/auth", authRoutes);

/* -------------------- Server -------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Trace Routes
app.use("/api/trace", require("./routes/traceRoutes"));