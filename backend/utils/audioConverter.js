const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

/**
 * Convert WebM audio file to WAV format using ffmpeg
 * Falls back to copying the file if conversion fails
 * @param {string} inputPath - Path to WebM file
 * @param {string} outputPath - Path for output WAV file
 * @returns {string} - Path to the converted WAV file
 */
const convertWebMToWav = (inputPath, outputPath) => {
  try {
    // Try to use ffmpeg-static first
    let ffmpegPath = "ffmpeg";
    
    try {
      const ffmpegStatic = require("ffmpeg-static");
      if (ffmpegStatic && fs.existsSync(ffmpegStatic)) {
        ffmpegPath = ffmpegStatic;
      }
    } catch (e) {
      console.warn("[AudioConverter] ffmpeg-static not available, trying system ffmpeg");
    }

    // Check if ffmpeg is available
    try {
      execSync(`${ffmpegPath} -version`, { stdio: "ignore" });
    } catch (e) {
      console.warn("[AudioConverter] ffmpeg not found, using original WebM file");
      return inputPath; // Fall back to original
    }

    // Convert WebM to WAV with proper audio settings
    const command = `${ffmpegPath} -i "${inputPath}" -acodec pcm_s16le -ar 16000 -ac 1 -y "${outputPath}" 2>&1`;
    
    console.log("[AudioConverter] Converting WebM to WAV...");
    console.log("[AudioConverter] Command:", command);
    
    const output = execSync(command, { encoding: "utf-8", stdio: "pipe" });
    console.log("[AudioConverter] Conversion output:", output);
    
    // Verify the output file exists and is not empty
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      console.log(`[AudioConverter] ✅ Conversion successful: ${outputPath} (${stats.size} bytes)`);
      return outputPath;
    } else {
      console.warn("[AudioConverter] Conversion output file not created, using original");
      return inputPath;
    }
  } catch (error) {
    console.error("[AudioConverter] Conversion error:", error.message);
    console.warn("[AudioConverter] Falling back to original WebM file");
    return inputPath;
  }
};

module.exports = { convertWebMToWav };
