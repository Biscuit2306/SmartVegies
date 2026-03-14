const express = require("express");
const router = express.Router();

// GET /api/trace/:batchId
router.get("/:batchId", (req, res) => {
  res.status(200).json({ 
      success: true, 
      message: `Traceability data for batch ${req.params.batchId} will go here.` 
  });
});

module.exports = router;