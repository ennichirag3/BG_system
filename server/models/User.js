const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: String,
  email: String,
  department: String,
  password: String,
});

module.exports = mongoose.model("User", userSchema);