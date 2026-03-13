const { DeepgramClient } = require("@deepgram/sdk");

console.log("Testing Deepgram SDK v5 structure...\n");

try {
  const client = new DeepgramClient({ apiKey: "test" });
  
  console.log("client.listen:", typeof client.listen);
  
  if (client.listen) {
    console.log("client.listen keys:", Object.keys(client.listen));
    
    console.log("\nclient.listen.v1:", typeof client.listen.v1);
    
    if (client.listen.v1) {
      console.log("client.listen.v1 keys:", Object.keys(client.listen.v1));
      
      console.log("\nclient.listen.v1.media:", typeof client.listen.v1.media);
      
      if (client.listen.v1.media) {
        console.log("client.listen.v1.media keys:", Object.keys(client.listen.v1.media));
      }
    }
  }
  
  // Check all top-level methods
  console.log("\n=== ALL CLIENT METHODS ===");
  const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(client));
  console.log("Available methods:", methods);
  
} catch (error) {
  console.error("Error:", error.message);
}
