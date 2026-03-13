const { DeepgramClient } = require("@deepgram/sdk");

console.log("Testing Deepgram SDK v5 media methods...\n");

try {
  const client = new DeepgramClient({ apiKey: "test" });
  
  // Get all methods from the media object
  const mediaProto = Object.getPrototypeOf(client.listen.v1.media);
  const mediaMethods = Object.getOwnPropertyNames(mediaProto);
  
  console.log("client.listen.v1.media methods:");
  console.log(mediaMethods);
  
  // Check if transcribeFile exists
  console.log("\ntranscribeFile exists:", typeof client.listen.v1.media.transcribeFile);
  
  // Get all property names and methods up the prototype chain
  console.log("\n=== Full method inspection ===");
  
  let obj = client.listen.v1.media;
  let level = 0;
  while (obj && level < 5) {
    const props = Object.getOwnPropertyNames(obj);
    console.log(`Level ${level}:`, props);
    obj = Object.getPrototypeOf(obj);
    level++;
  }
  
} catch (error) {
  console.error("Error:", error.message);
  console.error(error.stack);
}
