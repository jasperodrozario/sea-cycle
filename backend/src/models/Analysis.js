const mongoose = require("mongoose");

// "sub-schema" for each piece of debris found in an image.
const debrisItemSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
    },
    box: {
      type: [Number],
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
  overallAssessment: { type: String, default: "" },
  debrisData: [debrisItemSchema], // Array of debri items
  debrisCount: { type: Number, default: 0 },
  acknowledged: {
    type: Boolean,
    default: false,
  },
});

// Create and export the model, which allows us to interact with the 'analyses' collection
module.exports = mongoose.model("Analysis", analysisSchema);
