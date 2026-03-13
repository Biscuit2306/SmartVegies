require("dotenv").config();
const https = require("https");

console.log("🌐 Testing Deepgram API Connectivity\n");

// Test 1: DNS resolution
console.log("Test 1: DNS Resolution");
const dns = require("dns");
dns.resolve("api.deepgram.com", (err, addresses) => {
  if (err) {
    console.error("✗ DNS resolution failed:", err.message);
  } else {
    console.log("✓ DNS resolved to:", addresses);
  }
  
  // Test 2: HTTPS connection
  console.log("\nTest 2: HTTPS Connection");
  const options = {
    hostname: "api.deepgram.com",
    port: 443,
    path: "/",
    method: "GET",
    headers: {
      "Authorization": "Token " + process.env.DEEPGRAM_API_KEY
    }
  };

  const req = https.request(options, (res) => {
    console.log("✓ Connection successful!");
    console.log("Status code:", res.statusCode);
    console.log("Headers:", Object.keys(res.headers));
    
    // Test 3: Try actual API call
    console.log("\nTest 3: API Authentication");
    if (res.statusCode === 401) {
      console.error("✗ API key is invalid or expired");
    } else if (res.statusCode < 400) {
      console.log("✓ API key is valid");
    } else {
      console.log("? Unexpected status code:", res.statusCode);
    }
  });

  req.on("error", (e) => {
    console.error("✗ Connection failed:", e.message);
    console.error("  This indicates a network connectivity issue");
    
    console.log("\n📋 Troubleshooting steps:");
    console.log("1. Check your internet connection");
    console.log("2. Try: ping api.deepgram.com");
    console.log("3. Check firewall settings (should allow HTTPS/443)");
    console.log("4. Try disabling VPN if you have one");
    console.log("5. Restart your router");
  });

  req.end();
});
