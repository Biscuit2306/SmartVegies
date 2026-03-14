const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, reply: "API key is missing in the backend." });
        }

        // 1. Initialize the Gemini API
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // 2. Select the model and give it a personality (System Instructions)
       const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash", // Upgraded to the current live model // Flash is extremely fast, perfect for voice assistants
            systemInstruction: `You are the friendly, helpful AI voice assistant for 'SmartVegies', an agricultural platform. 
            Your users are farmers (who want to sell produce, check subsidies, and view crop data) and vendors (who want to buy produce and track inventory).
            
            Rules:
            1. Keep your answers brief and conversational (1-3 sentences max) because they are being read out loud by a text-to-speech engine.
            2. Be polite and welcoming.
            3. Do not use markdown formatting like **bold** or *italics* or bullet points, because the text-to-speech engine will read them weirdly. Use plain text and natural punctuation.`
        });

        console.log(`Asking Gemini: "${message}"`);

        // 3. Send the user's voice text to Gemini
        const result = await model.generateContent(message);
        
        // 4. Extract the text response
        const aiResponse = result.response.text();

        // 5. Send it back to the React frontend to be spoken aloud
        res.status(200).json({ success: true, reply: aiResponse });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ success: false, reply: "Sorry, I am having trouble connecting to my brain right now." });
    }
});

module.exports = router;