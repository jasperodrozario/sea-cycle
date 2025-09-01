const mongoose = require("mongoose");

const buoySchema = new mongoose.Schema({
  buoyId: {
    type: String,
    required: true,
    unique: true,
  },
  fillLevelPercentage,
  batteryPercentage,
});
