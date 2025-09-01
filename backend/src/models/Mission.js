const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema({
  missionName: {
    type: String,
    required: true,
    default: () => `Mission - ${new Date().toLocaleDateString()}`,
  },
  status: {
    type: String,
    enum: ["Pending", "Dispatched", "In Progress", "Completed", "Cancelled"],
    default: "Pending",
    required: true,
  },
  // This links to the User who is assigned the mission
  assignedCrew: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // This refers to our 'User' model
    required: true,
  },
  // This will store the IDs of the analysis reports that are part of this mission
  analysisHotspots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Analysis",
    },
  ],
  creationDate: {
    type: Date,
    default: Date.now,
  },
  completionDate: {
    type: Date,
  },
  notes: {
    type: String,
  },
});

module.exports = mongoose.model("Mission", missionSchema);
