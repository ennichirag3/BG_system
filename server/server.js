const express = require("express");
const cors = require("cors");
require("dotenv").config();

// SQLITE DATABASE INITIALIZATION
const db = require("./config/db");

const bgRoutes = require("./routes/bgRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// =======================
// CORS FIX
// =======================
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// =======================
// BODY PARSER
// =======================
app.use(express.json());

// =======================
// STATIC FILES
// =======================
app.use("/uploads", express.static("uploads"));

// =======================
// LOGGING
// =======================
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

// =======================
// HEALTH CHECK
// =======================
app.get("/", (req, res) => {
  res.json({
    message: "BG Management Backend Working (SQLite)",
    database: "SQLite3 (Local Persistent)",
    status: "online",
  });
});

// =======================
// ROUTES
// =======================
app.use("/api/bg", bgRoutes);
app.use("/api/auth", authRoutes);

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`🚀 SQLite Server running on port ${PORT}`);
});

// =======================
// GRACEFUL SHUTDOWN (Clean SQLite close)
// =======================
const cleanExit = () => {
  console.log("\n🔒 Closing SQLite database connection cleanly...");
  try {
    db.close();
    console.log("✅ Database closed.");
  } catch (err) {
    console.error("Error closing DB:", err);
  }
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", cleanExit);
process.on("SIGTERM", cleanExit);
