require("dotenv").config();
const { DeepgramClient } = require("@deepgram/sdk");
const fs = require("fs");

/**
 * Test script to debug Deepgram response structure
 * This will help identify what's wrong with the transcript data
 */

const testDeepgramResponse = async () => {
  try {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    console.log("Testing Deepgram response structure...\n");

    const client = new DeepgramClient({ apiKey });

    // Create a minimal test audio file (generated silence)
    const testFilePath = "test-silence.wav";
    if (!fs.existsSync(testFilePath)) {
      // Create a minimal WAV file with silence
      const wavHeader = Buffer.from([
        0x52, 0x49, 0x46, 0x46, // "RIFF"
        0x24, 0xf0, 0x00, 0x00, // chunk size
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
        0x00, 0xf0, 0x00, 0x00  // subchunk2 size (61440 bytes = 1.4 seconds of silence)
      ]);

      // Create silence data
      const silenceData = Buffer.alloc(61440, 0x00);

      fs.writeFileSync(testFilePath, Buffer.concat([wavHeader, silenceData]));
      console.log("✓ Created test WAV file with silence\n");
    }

    console.log("Testing transcription with different options...\n");

    // Test 1: Basic transcription
    console.log("Test 1: Basic English transcription");
    try {
      const stream1 = fs.createReadStream(testFilePath);
      const response1 = await client.listen.v1.media.transcribeFile(stream1, {
        model: "nova-2",
        language: "en",
      });

      console.log("✓ Response received");
      console.log("Response structure:");
      console.log("- response.results:", !!response1.results);
      console.log("- response.results.channels:", !!response1.results?.channels);
      console.log("- response.results.channels[0]:", !!response1.results?.channels?.[0]);
      console.log("- response.results.channels[0].alternatives:", !!response1.results?.channels?.[0]?.alternatives);
      console.log("- response.results.channels[0].alternatives[0]:", !!response1.results?.channels?.[0]?.alternatives?.[0]);
      console.log("- response.results.channels[0].alternatives[0].transcript:", response1.results?.channels?.[0]?.alternatives?.[0]?.transcript);
      
      console.log("\nFull channel structure:");
      console.log(JSON.stringify(response1.results?.channels?.[0], null, 2));
      
    } catch (e) {
      console.error("✗ Error:", e.message);
    }

    // Test 2: With smart_format
    console.log("\n\nTest 2: With smart_format");
    try {
      const stream2 = fs.createReadStream(testFilePath);
      const response2 = await client.listen.v1.media.transcribeFile(stream2, {
        model: "nova-2",
        language: "en",
        smart_format: true,
      });

      console.log("✓ Response received");
      console.log("- transcript:", response2.results?.channels?.[0]?.alternatives?.[0]?.transcript);
    } catch (e) {
      console.error("✗ Error:", e.message);
    }

    // Test 3: With different language
    console.log("\n\nTest 3: Hindi transcription");
    try {
      const stream3 = fs.createReadStream(testFilePath);
      const response3 = await client.listen.v1.media.transcribeFile(stream3, {
        model: "nova-2",
        language: "hi",
      });

      console.log("✓ Response received");
      console.log("- transcript:", response3.results?.channels?.[0]?.alternatives?.[0]?.transcript);
    } catch (e) {
      console.error("✗ Error:", e.message);
    }

  } catch (error) {
    console.error("Fatal error:", error.message);
    console.error(error.stack);
  }

  console.log("\n\nConclusion:");
  console.log("If all tests show empty transcripts, it's because the audio is silence.");
  console.log("The structure is correct if you see the path to transcript is working.");
  console.log("To test with real audio, use an actual WAV or MP3 file.");
};

testDeepgramResponse();
