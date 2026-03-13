const mongoose = require("mongoose");

const voiceLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    transcript: {
      type: String,
      required: true,
      trim: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: null,
    },
    duration: {
      type: Number, // in seconds
      default: null,
    },
    language: {
      type: String,
      default: "en",
    },
    fileName: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("VoiceLog", voiceLogSchema);