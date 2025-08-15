const mongoose = require("mongoose");

// "sub-schema" for each piece of debris found in an image.
const debrisItemSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
    },
    box: {
      type: [Number], // An array of numbers [x_min, y_min, x_max, y_max]
      required: true,
    },
  },
  { _id: false }
); // Keeping ID for each debris item is irrelevant

// Main schema for the analysis document
const analysisSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
    unique: true, // Prevent saving the same image analysis twice
  },
  analysisDate: {
    type: Date,
    default: Date.now,
  },
  imageLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  debrisData: [debrisItemSchema], // Array of debri items
});

// Create and export the model, which allows us to interact with the 'analyses' collection
module.exports = mongoose.model("Analysis", analysisSchema);
