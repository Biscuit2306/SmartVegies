const { DeepgramClient } = require("@deepgram/sdk");
const fs = require("fs");
const path = require("path");

// Initialize Deepgram client - automatically reads DEEPGRAM_API_KEY from environment
const getDeepgramClient = () => {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPGRAM_API_KEY is not set in environment variables. Check your .env file.");
  }
  
  console.log("[Deepgram Service] Initializing client with API key (length: " + apiKey.length + ")");
  
  // SDK automatically uses DEEPGRAM_API_KEY from environment if no apiKey provided
  // But we can also pass it explicitly for clarity
  return new DeepgramClient({ apiKey: apiKey });
};

// Transcribe audio file using Deepgram SDK v5
const transcribeAudio = async (filePath, language = "en") => {
  try {
    // Validate file existence
    if (!fs.existsSync(filePath)) {
      throw new Error(`Audio file not found: ${filePath}`);
    }

    console.log("[Deepgram Service] Starting transcription...");
    console.log("[Deepgram Service] File path:", filePath);
    console.log("[Deepgram Service] Language:", language);

    // Initialize client
    console.log("[Deepgram Service] Initializing Deepgram client...");
    const deepgram = getDeepgramClient();
    console.log("[Deepgram Service] Client initialized successfully");

    // Validate client structure
    console.log("[Deepgram Service] Validating client structure...");
    if (!deepgram || typeof deepgram !== "object") {
      throw new Error("Deepgram client is not an object");
    }
    if (!deepgram.listen) {
      throw new Error("Client does not have 'listen' property");
    }
    if (!deepgram.listen.v1) {
      throw new Error("Client.listen does not have 'v1' property");
    }
    if (!deepgram.listen.v1.media) {
      throw new Error("Client.listen.v1 does not have 'media' property");
    }
    if (typeof deepgram.listen.v1.media.transcribeFile !== "function") {
      throw new Error("Client.listen.v1.media.transcribeFile is not a function: " + typeof deepgram.listen.v1.media.transcribeFile);
    }

    console.log("[Deepgram Service] Client structure validated ✓");

    // Get file extension to determine media type
    const ext = path.extname(filePath).toLowerCase();
    const mediaTypeMap = {
      '.wav': 'audio/wav',
      '.mp3': 'audio/mpeg',
      '.ogg': 'audio/ogg',
      '.webm': 'audio/webm',
      '.flac': 'audio/flac',
      '.m4a': 'audio/mp4',
      '.mp4': 'audio/mp4',
    };
    
    const contentType = mediaTypeMap[ext] || 'audio/wav';
    console.log("[Deepgram Service] Content type:", contentType);
    
    // Read file as buffer
    console.log("[Deepgram Service] Reading file into buffer...");
    const audioBuffer = fs.readFileSync(filePath);
    console.log("[Deepgram Service] File read successfully, size:", audioBuffer.length, "bytes");
    
    if (audioBuffer.length === 0) {
      throw new Error("Audio file is empty (0 bytes)");
    }

    console.log("[Deepgram Service] Calling transcribeFile API with buffer and content-type...");

    // Transcribe using v5 API - try passing buffer as uploadable with proper content-type in request options
    const response = await deepgram.listen.v1.media.transcribeFile(audioBuffer, {
      model: "nova-2",
      language: language,
      smart_format: true,
      punctuate: true,
      contentType: contentType,
    });

    console.log("[Deepgram Service] API call completed");
    console.log("[Deepgram Service] Transcription completed successfully");

    // Parse response - Deepgram SDK v5 structure
    if (!response) {
      throw new Error("Empty response from Deepgram API");
    }

    console.log("[Deepgram Service] Full response:", JSON.stringify(response, null, 2));

    const results = response.results;
    console.log("[Deepgram Service] Results:", JSON.stringify(results, null, 2));
    
    if (!results || !results.channels || results.channels.length === 0) {
      throw new Error("No transcription channels returned from Deepgram");
    }

    const channel = results.channels[0];
    console.log("[Deepgram Service] Channel:", JSON.stringify(channel, null, 2));
    
    const alternative = channel.alternatives?.[0];
    console.log("[Deepgram Service] Alternative:", JSON.stringify(alternative, null, 2));

    if (!alternative) {
      throw new Error("No alternatives returned from Deepgram");
    }

    // Check if transcript is empty
    if (!alternative.transcript || alternative.transcript.trim().length === 0) {
      console.warn("[Deepgram Service] ⚠️ WARNING: Empty transcript received from Deepgram");
      console.warn("[Deepgram Service] This may indicate:");
      console.warn("  - Audio is silent or no clear speech detected");
      console.warn("  - Audio sample rate is incorrect or corrupted");
      console.warn("  - File format issue or encoding problem");
      console.warn("  - Language mismatch (selected language doesn't match audio content)");
      console.warn("[Deepgram Service] Please try:");
      console.warn("  1. Record clear speech (not silence)");
      console.warn("  2. Use WAV or MP3 format (more reliable)");
      console.warn("  3. Make sure audio duration is at least 1-2 seconds");
      console.warn("  4. Check that the selected language matches the speech in audio");
      console.warn("[Deepgram Service] Full response:", JSON.stringify(response, null, 2));
      
      // Return empty transcript but don't throw error - let user know what happened
      return {
        transcript: "",
        confidence: alternative.confidence ?? null,
        words: alternative.words || [],
        duration: results.metadata?.duration ?? null,
        warning: "Empty transcript - please try recording again with clear speech"
      };
    }

    return {
      transcript: alternative.transcript.trim(),
      confidence: alternative.confidence ?? null,
      words: alternative.words || [],
      duration: results.metadata?.duration ?? null,
    };
  } catch (error) {
    // Enhanced error logging for debugging
    console.error("[Deepgram Service] Error:", error.message);
    
    // Check for network/connectivity errors
    if (error.message.includes("fetch failed") || error.message.includes("ENOTFOUND") || error.message.includes("ECONNREFUSED")) {
      console.error("[Deepgram Service] ⚠️ NETWORK ERROR: Cannot reach Deepgram API");
      console.error("[Deepgram Service] This may indicate:");
      console.error("  - Network connectivity issue");
      console.error("  - Firewall/proxy blocking the connection");
      console.error("  - DNS resolution failure");
      console.error("  - Deepgram API server is temporarily down");
      console.error("[Deepgram Service] Try:");
      console.error("  1. Check your internet connection");
      console.error("  2. Check if your firewall allows outgoing HTTPS connections");
      console.error("  3. Try again in a few moments");
    }
    
    // Check for authentication/API key errors
    if (error.message.includes("401") || error.message.includes("Unauthorized") || error.message.includes("authentication")) {
      console.error("[Deepgram Service] ⚠️ API KEY ISSUE: Your Deepgram API key may be invalid or expired.");
      console.error("[Deepgram Service] Please verify your DEEPGRAM_API_KEY in .env file.");
    }
    
    // Check for empty transcript
    if (error.message.includes("empty transcript")) {
      console.error("[Deepgram Service] ℹ️ Audio Issue: Empty transcript returned");
      console.error("[Deepgram Service] Try uploading WAV or MP3 instead of WebM");
    }
    
    if (error.stack) {
      console.error("[Deepgram Service] Stack:", error.stack);
    }
    
    throw error;
  }
};

module.exports = { transcribeAudio };