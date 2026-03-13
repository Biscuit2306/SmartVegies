// Load environment variables
require("dotenv").config();

// Test transcription using buffer approach
const { transcribeAudio } = require("./utils/deepgramService");
const fs = require("fs");
const path = require("path");

async function testTranscription() {
  try {
    // Find the most recent uploaded audio file
    const uploadsDir = path.join(__dirname, "uploads");
    
    if (!fs.existsSync(uploadsDir)) {
      console.log("❌ Uploads directory does not exist");
      return;
    }
    
    const files = fs.readdirSync(uploadsDir)
      .filter(f => f.endsWith('.webm') || f.endsWith('.wav') || f.endsWith('.mp3') || f.endsWith('.ogg'))
      .map(f => ({
        name: f,
        path: path.join(uploadsDir, f),
        time: fs.statSync(path.join(uploadsDir, f)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time);
    
    if (files.length === 0) {
      console.log("❌ No audio files found in uploads directory");
      console.log("📝 Please upload an audio file first using the frontend");
      return;
    }
    
    const latestFile = files[0];
    console.log(`\n📤 Testing with file: ${latestFile.name}`);
    console.log(`📊 File size: ${fs.statSync(latestFile.path).size} bytes`);
    console.log(`⏰ Modified: ${new Date(latestFile.time).toLocaleString()}\n`);
    
    // Test transcription with different languages
    const languages = ["en"];
    
    for (const lang of languages) {
      console.log(`\n🎯 Testing ${lang.toUpperCase()} transcription...`);
      try {
        const result = await transcribeAudio(latestFile.path, lang);
        console.log(`✅ SUCCESS!`);
        console.log(`📝 Transcript: ${result.transcript}`);
        console.log(`📊 Confidence: ${result.confidence}`);
        console.log(`⏱️  Duration: ${result.duration}s`);
        break; // If one language works, stop
      } catch (err) {
        console.log(`❌ ${lang.toUpperCase()} failed: ${err.message}`);
      }
    }
    
  } catch (err) {
    console.error("Error:", err.message);
    console.error(err.stack);
  }
}

testTranscription();
