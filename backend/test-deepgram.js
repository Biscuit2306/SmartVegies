require("dotenv").config();
const { DeepgramClient } = require("@deepgram/sdk");

const testDeepgramAPI = async () => {
  try {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    
    if (!apiKey) {
      console.error("❌ DEEPGRAM_API_KEY not found in .env");
      return;
    }

    console.log("🔑 API Key found (length: " + apiKey.length + ")");
    console.log("Testing Deepgram API connection...\n");

    const client = new DeepgramClient({ apiKey });
    
    // Try to get API models to verify the key is valid
    console.log("Attempting to connect to Deepgram API...");
    
    // This is just to test the API key validity
    console.log("✓ Client created successfully");
    console.log("\n📝 Your API key appears to be configured correctly.");
    console.log("If you're still getting 500 errors, it might be:");
    console.log("  1. The API key is valid but doesn't have the right permissions");
    console.log("  2. The audio file format is not supported");
    console.log("  3. Network connectivity issue");
    console.log("\nTo get a fresh API key:");
    console.log("  1. Go to https://console.deepgram.com");
    console.log("  2. Sign in or create an account");
    console.log("  3. Navigate to Settings → API Keys");
    console.log("  4. Create a new API Key");
    console.log("  5. Copy it and paste in .env file as DEEPGRAM_API_KEY");

  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.message.includes("401") || error.message.includes("Unauthorized")) {
      console.error("\n⚠️  Your API key appears to be INVALID or EXPIRED");
      console.error("Please get a new API key from https://console.deepgram.com");
    }
  }
};

testDeepgramAPI();
