const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../config/db");

// ======================
// REGISTER
// ======================
router.post("/register", async (req, res) => {
  try {
    const { phoneNumber, fullName, email, department, password } = req.body;

    console.log("REGISTER BODY:", req.body);

    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone number and password required",
      });
    }

    const existingUser = db.prepare("SELECT * FROM users WHERE phoneNumber = ?").get(phoneNumber);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = "usr-" + Date.now();

    db.prepare(`
      INSERT INTO users (_id, phoneNumber, fullName, email, department, password, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      phoneNumber,
      fullName || "User",
      email || "",
      department || "General",
      hashedPassword,
      "BG Administrator"
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully in SQLite",
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================
// LOGIN
// ======================
router.post("/login", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    console.log("LOGIN BODY:", req.body);

    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone number and password required",
      });
    }

    const user = db.prepare("SELECT * FROM users WHERE phoneNumber = ?").get(phoneNumber);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        _id: user._id,
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        email: user.email,
        department: user.department,
        role: user.role,
      },
      token: "sqlite-jwt-token-" + user._id,
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
