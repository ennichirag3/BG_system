const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ======================
// REGISTER
// ======================
router.post("/register", async (req, res) => {
  try {
    const { phoneNumber, fullName, email, department, password } = req.body;

    // check duplicate user
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const newUser = new User({
      phoneNumber,
      fullName,
      email,
      department,
      password, // (later we will hash this)
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Account created successfully",
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

    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      user,
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