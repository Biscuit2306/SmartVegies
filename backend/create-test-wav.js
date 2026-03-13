// Create a minimal WAV file for testing
const fs = require("fs");
const path = require("path");

// Create a simple 2-second silence WAV file for testing
function createTestWavFile() {
  const sampleRate = 16000;
  const duration = 2; // seconds
  const channels = 1;
  const bitsPerSample = 16;
  
  // WAV header structure
  const numSamples = sampleRate * duration * channels;
  const byteRate = sampleRate * channels * bitsPerSample / 8;
  const blockAlign = channels * bitsPerSample / 8;
  
  // Create buffer for WAV file
  const wavSize = 36 + numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + numSamples * blockAlign);
  
  // Write RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * blockAlign, 4);
  buffer.write('WAVE', 8);
  
  // Write fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subChunk1Size
  buffer.writeUInt16LE(1, 20); // audioFormat (1 = PCM)
  buffer.writeUInt16LE(channels, 22); // numChannels
  buffer.writeUInt32LE(sampleRate, 24); // sampleRate
  buffer.writeUInt32LE(byteRate, 28); // byteRate
  buffer.writeUInt16LE(blockAlign, 32); // blockAlign
  buffer.writeUInt16LE(bitsPerSample, 34); // bitsPerSample
  
  // Write data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * blockAlign, 40);
  
  // Fill audio data with zeros (silence)
  for (let i = 0; i < numSamples; i++) {
    buffer.writeInt16LE(0, 44 + i * 2);
  }
  
  return buffer;
}

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const wavBuffer = createTestWavFile();
const testFilePath = path.join(uploadsDir, "test-silence.wav");
fs.writeFileSync(testFilePath, wavBuffer);

console.log(`✅ Test WAV file created: ${testFilePath}`);
console.log(`📊 File size: ${wavBuffer.length} bytes`);
console.log(`⏱️  Duration: 2 seconds (silence)`);
console.log(`\n📝 Run 'node test-buffer-transcription.js' to test transcription`);
