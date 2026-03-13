const Batch = require("../models/Batch");

exports.getBatchDetails = async (req, res) => {
  try {
    const batch = await Batch.findOne({ batchId: req.params.batchId }).populate("farmer", "name farmName");
    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }
    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};