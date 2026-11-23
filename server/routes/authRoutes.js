const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../config/db");

// ======================
// REGISTER
// ======================
router.post("/register", async (req, res) => {
  try {
    const { phoneNumber, fullName, email, department, password, role } = req.body;

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
        message: "User with this phone number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = "usr-" + Date.now();

    // Default regular registered users to "Requester", ONLY designated admin gets Admin privileges
    const assignedRole = role === "Admin" ? "Requester" : (role || "Requester");

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
      assignedRole
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: userId,
        phoneNumber,
        fullName: fullName || "User",
        role: assignedRole,
      },
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
    const { phoneNumber, email, password } = req.body;

    console.log("LOGIN REQUEST:", { phoneNumber, email });

    if ((!phoneNumber && !email) || !password) {
      return res.status(400).json({
        success: false,
        message: "Credentials and password required",
      });
    }

    let user;
    if (phoneNumber) {
      user = db.prepare("SELECT * FROM users WHERE phoneNumber = ?").get(phoneNumber);
    } else if (email) {
      user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found. Please register or check details.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password. Click 'Forgot Password?' to reset.",
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
        role: user.role || "Requester",
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

// ======================
// FORGOT PASSWORD - VERIFY ACCOUNT
// ======================
router.post("/verify-account", (req, res) => {
  try {
    const { identifier } = req.body; // Phone or Email

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Please enter your registered Phone Number or Email",
      });
    }

    const user = db.prepare(
      "SELECT _id, phoneNumber, fullName, email, role FROM users WHERE phoneNumber = ? OR email = ?"
    ).get(identifier.trim(), identifier.trim());

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found matching this Phone Number or Email.",
      });
    }

    res.json({
      success: true,
      message: "Account verified successfully",
      data: {
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("VERIFY ACCOUNT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ======================
// RESET PASSWORD
// ======================
router.post("/reset-password", async (req, res) => {
  try {
    const { identifier, newPassword } = req.body;

    if (!identifier || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Identifier and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const user = db.prepare(
      "SELECT * FROM users WHERE phoneNumber = ? OR email = ?"
    ).get(identifier.trim(), identifier.trim());

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    db.prepare(`
      UPDATE users
      SET password = ?
      WHERE _id = ?
    `).run(hashedPassword, user._id);

    console.log(`✅ Password successfully reset for user ${user.phoneNumber} (${user.fullName})`);

    res.json({
      success: true,
      message: "Password has been successfully updated! You can now sign in.",
    });
  } catch (error) {
    console.log("RESET PASSWORD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
