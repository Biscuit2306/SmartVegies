// backend/routes/traceRoutes.js
const express = require("express");
const router = express.Router();
const { getBatchDetails } = require("../controllers/traceController");

router.get("/:batchId", getBatchDetails);

module.exports = router;