const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Removes whitespace from both ends
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
    lowercase: true, // Always store email in lowercase
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    // Enum ensures the role can only be one of these three values
    enum: ["Citizen", "Authority", "Admin"],
    default: "Citizen", // New users will be a 'Citizen' by default
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the date when a user is created
  },
});

module.exports = mongoose.model("User", userSchema);
