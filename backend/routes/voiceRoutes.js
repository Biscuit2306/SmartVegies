const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");

// Configure multer to process the audio file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/voice/transcribe
router.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    // 1. Check for API Key
    if (!process.env.DEEPGRAM_API_KEY || process.env.DEEPGRAM_API_KEY.includes("your_actual")) {
        return res.status(500).json({ 
            success: false, 
            message: "Missing or invalid DEEPGRAM_API_KEY in backend .env file." 
        });
    }

    // 2. Extract Audio Buffer safely
    let audioBuffer;
    let mimeType = 'audio/webm'; 

    if (req.file) {
      audioBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
    } else if (req.body && req.body.audio) {
      const base64Data = req.body.audio.split(';base64,').pop();
      audioBuffer = Buffer.from(base64Data, 'base64');
    } else {
      return res.status(400).json({ 
          success: false, 
          message: "No audio found. Expected FormData with 'audio'." 
      });
    }

    // ---> FIX: Grab the language sent from the frontend (default to English if missing)
    const selectedLanguage = req.body.language || "en";

    console.log(`Sending ${audioBuffer.length} bytes to Deepgram (Language: ${selectedLanguage})...`);

   // Deepgram doesn't support Punjabi ('pa') yet. Fallback to Hindi ('hi') to prevent a crash.
    let safeLanguage = selectedLanguage;
    if (safeLanguage === 'pa') {
        safeLanguage = 'hi'; 
    }

    const deepgramUrl = `https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true&language=${safeLanguage}`;

    // 3. Make HTTP REQUEST to Deepgram using Axios
    const response = await axios.post(
        deepgramUrl,
        audioBuffer,
        {
            headers: {
                "Authorization": `Token ${process.env.DEEPGRAM_API_KEY}`,
                "Content-Type": mimeType
            },
            maxBodyLength: Infinity,     
            maxContentLength: Infinity,  
            timeout: 60000               
        }
    );

    // 4. Extract Text
    const transcript = response.data.results?.channels[0]?.alternatives[0]?.transcript || " (No speech detected) ";

    // 5. Send successful response back to React
    res.status(200).json({
      success: true,
      text: transcript,
      transcript: transcript,
      data: transcript
    });

  } catch (error) {
    console.error("Transcription Error:", error.message);
    
    res.status(500).json({ 
        success: false, 
        message: "Failed to transcribe audio.",
        details: error.response?.data || error.message
    });
  }
});

module.exports = router;