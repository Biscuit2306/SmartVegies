require("dotenv").config();
const { DeepgramClient } = require("@deepgram/sdk");
const fs = require("fs");

console.log("Testing Deepgram client initialization...\n");

try {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  console.log("API Key from env:", apiKey ? "✓ Found" : "✗ Not found");
  
  // Create client same way as in deepgramService.js
  const client = new DeepgramClient({ apiKey: apiKey });
  
  console.log("Client created successfully");
  console.log("client.listen:", typeof client.listen);
  console.log("client.listen.v1:", typeof client.listen.v1);
  console.log("client.listen.v1.media:", typeof client.listen.v1.media);
  console.log("client.listen.v1.media.transcribeFile:", typeof client.listen.v1.media?.transcribeFile);
  
  // Test with a mock file stream
  console.log("\nTesting file stream creation...");
  const testFilePath = "test.wav";  // Just checking if we can create a stream
  
  if (!fs.existsSync(testFilePath)) {
    console.log("Creating temporary test audio file...");
    // Create a minimal WAV file for testing
    const wavHeader = Buffer.from([
      0x52, 0x49, 0x46, 0x46, // "RIFF"
      0x24, 0x00, 0x00, 0x00, // chunk size
      0x57, 0x41, 0x56, 0x45, // "WAVE"
      0x66, 0x6d, 0x74, 0x20, // "fmt "
      0x10, 0x00, 0x00, 0x00, // subchunk1 size
      0x01, 0x00,             // audio format (PCM)
      0x01, 0x00,             // num channels
      0x44, 0xac, 0x00, 0x00, // sample rate (44100)
      0x88, 0x58, 0x01, 0x00, // byte rate
      0x02, 0x00,             // block align
      0x10, 0x00,             // bits per sample
      0x64, 0x61, 0x74, 0x61, // "data"
      0x00, 0x00, 0x00, 0x00  // subchunk2 size
    ]);
    
    fs.writeFileSync(testFilePath, wavHeader);
    console.log("Test file created");
  }
  
  const stream = fs.createReadStream(testFilePath);
  console.log("File stream created successfully");
  
  // Try to call transcribeFile
  console.log("\nAttempting to call transcribeFile...");
  client.listen.v1.media.transcribeFile(stream, {
    model: "nova-2",
    language: "en",
  }).then(() => {
    console.log("✓ Call successful (but audio was invalid)");
  }).catch(e => {
    console.log("Error from Deepgram API (expected for invalid audio):");
    console.log(e.message);
  });
  
} catch (error) {
  console.error("❌ Error during initialization:", error.message);
  console.error(error.stack);
}
