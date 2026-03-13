const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmer",
    required: true
  },
  vegetableName: { type: String, required: true },
  batchId: { type: String, required: true, unique: true }, // e.g., SV-NASHIK-101
  harvestDate: { type: Date, default: Date.now },
  origin: { type: String, required: true }, // e.g., "Nashik, Maharashtra"
  description: { type: String },
  qrCodeData: { type: String } // Stores the generated QR string or URL
}, { timestamps: true });

module.exports = mongoose.model("Batch", batchSchema);