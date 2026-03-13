const express = require("express");
const router = express.Router();

const { transcribeVoice, getVoiceLogs } = require("../controllers/voiceController");
const upload = require("../utils/upload");
const { protect } = require("../middleware/authMiddleware");

/**
 * @route   GET /api/voice
 * @access  Public
 * @desc    Health check and API info
 */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Voice Transcription API",
    endpoints: {
      transcribe: "POST /api/voice/transcribe (send FormData with 'audio' file)",
      logs: "GET /api/voice/logs (requires authentication)",
    },
    supportedFormats: ["mp3", "wav", "ogg", "webm", "flac", "mp4", "m4a"],
    maxFileSize: "25 MB",
  });
});

/**
 * @route   POST /api/voice/transcribe
 * @access  Public
 * @desc    Transcribe audio file to text
 */
router.post("/transcribe", upload.single("audio"), transcribeVoice);

/**
 * @route   GET /api/voice/logs
 * @access  Protected
 * @desc    Get transcription history
 */
router.get("/logs", protect, getVoiceLogs);

module.exports = router;