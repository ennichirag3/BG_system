const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const bgRoutes = require("./routes/bgRoutes");
const authRoutes = require("./routes/authRoutes"); // ✅ ADDED

const app = express();

// =======================
// CORS
// =======================
app.use(cors({
  origin: "*",
}));

// =======================
// JSON BODY PARSER
// =======================
app.use(express.json());

// =======================
// STATIC FILES (uploads)
// =======================
app.use("/uploads", express.static("uploads"));

// =======================
// DEBUG MIDDLEWARE
// =======================
app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

// =======================
// TEST ROUTE
// =======================
app.get("/", (req, res) => {
  res.json({
    message: "Backend working",
  });
});

// =======================
// ROUTES
// =======================
app.use("/api/bg", bgRoutes);       // BG SYSTEM ROUTES
app.use("/api/auth", authRoutes);   // 🔐 AUTH ROUTES (NEW)

// =======================
// DATABASE CONNECTION
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err.message);
  });

// =======================
// SERVER PORT
// =======================
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});