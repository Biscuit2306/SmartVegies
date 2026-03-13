const fs = require("fs");
const path = require("path");
const { transcribeAudio } = require("../utils/deepgramService");
const { convertWebMToWav } = require("../utils/audioConverter");
const VoiceLog = require("../models/VoiceLog");

/**
 * POST /api/voice/transcribe
 * Accepts an audio file upload, transcribes it via Deepgram,
 * saves a log entry, and returns the transcript.
 */
const transcribeVoice = async (req, res) => {
  let filePath = req.file?.path;
  let tempWavPath = null;

  try {
    // ── 1. Validate file presence ────────────────────────────────────────────
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No audio file uploaded. Please attach a valid audio file.",
      });
    }

    // ── 2. Convert WebM to WAV if needed ─────────────────────────────────────
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    if (fileExt === ".webm") {
      console.log("[VoiceController] WebM file detected, converting to WAV...");
      tempWavPath = filePath.replace(".webm", ".wav");
      filePath = convertWebMToWav(filePath, tempWavPath);
      console.log("[VoiceController] Using audio file:", filePath);
    }

    // ── 3. Read language preference (default: English) ───────────────────────
    const language = req.body.language || "en";

    // ── 3. Transcribe via Deepgram ───────────────────────────────────────────
    const { transcript, confidence, words, duration, warning } = await transcribeAudio(
      filePath,
      language
    );

    // Check for empty transcript
    if (!transcript || transcript.trim().length === 0) {
      // Clean up file 
      fs.unlink(filePath, (err) => {
        if (err) console.warn(`[VoiceController] Failed to delete temp file: ${filePath}`);
      });

      return res.status(422).json({
        success: false,
        message: warning || "No speech detected in the audio. Please provide clear audio with at least 1-2 seconds of speech.",
        hint: "Tips: Record clear speech, use WAV or MP3 format, ensure proper audio duration",
      });
    }

    // ── 4. Persist log to database ───────────────────────────────────────────
    const log = await VoiceLog.create({
      userId: req.user?.id || null,
      transcript,
      confidence,
      duration,
      language,
      fileName: req.file.originalname,
    });

    // ── 5. Clean up uploaded files from server ───────────────────────────────
    fs.unlink(req.file.path, (err) => {
      if (err) console.warn(`[VoiceController] Failed to delete original file: ${req.file.path}`);
    });
    
    // Clean up converted WAV file if it was created
    if (tempWavPath && tempWavPath !== req.file.path && fs.existsSync(tempWavPath)) {
      fs.unlink(tempWavPath, (err) => {
        if (err) console.warn(`[VoiceController] Failed to delete temp WAV file: ${tempWavPath}`);
      });
    }

    // ── 6. Respond ───────────────────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      message: "Audio transcribed successfully.",
      data: {
        logId: log._id,
        transcript,
        confidence,
        duration,
        wordCount: words.length,
        language,
      },
    });
  } catch (error) {
    console.error("[VoiceController] Transcription error:", error.message);
    console.error("[VoiceController] Error stack:", error.stack);

    // Clean up files on error too
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, () => {});
    }
    
    // Clean up converted WAV file if it was created
    if (tempWavPath && fs.existsSync(tempWavPath)) {
      fs.unlink(tempWavPath, () => {});
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred during transcription. Please try again.",
      ...(process.env.NODE_ENV === "development" && { 
        error: error.message,
        stack: error.stack 
      }),
    });
  }
};

/**
 * GET /api/voice/logs
 * Returns transcription history for the authenticated user.
 */
const getVoiceLogs = async (req, res) => {
  try {
    const logs = await VoiceLog.find({ userId: req.user?.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("transcript confidence duration language fileName createdAt");

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error("[VoiceController] Fetch logs error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve voice logs.",
    });
  }
};

module.exports = { transcribeVoice, getVoiceLogs };