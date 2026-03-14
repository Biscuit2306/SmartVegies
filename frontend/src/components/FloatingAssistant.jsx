import React, { useState, useRef } from "react";
import axios from "axios";

export default function FloatingAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [chatHistory, setChatHistory] = useState([
        { sender: "ai", text: "Hi! I am the SmartVegies Assistant. Tap the microphone, speak clearly, and tap it again to send!" }
    ]);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // 1. Start Recording Audio (Forced standard Codec)
    const startRecording = async () => {
        try {
            window.speechSynthesis.cancel(); 
            setIsSpeaking(false);
            
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // ---> FIX: Force Chrome to use standard, Deepgram-friendly encoding
            let options = { mimeType: 'audio/webm;codecs=opus' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options = { mimeType: 'audio/webm' }; // Fallback
            }
            
            const recorder = new MediaRecorder(stream, options);
            audioChunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            recorder.onstop = async () => {
                // ---> FIX: Package it safely as a raw blob so metadata isn't stripped
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                stream.getTracks().forEach((t) => t.stop());
                
                if (blob.size === 0) {
                    setChatHistory(prev => [...prev, { sender: "ai", text: "⚠️ My ears didn't catch any audio. Make sure your mic is unmuted!" }]);
                    setIsProcessing(false);
                    return;
                }

                // Process the recorded audio
                await processVoiceCommand(blob);
            };

            mediaRecorderRef.current = recorder;
            recorder.start(); 
            setIsListening(true);
            
        } catch (err) {
            console.error("Microphone error:", err);
            setChatHistory(prev => [...prev, { sender: "ai", text: "⚠️ Microphone access denied. Please check your browser permissions." }]);
        }
    };

    // 2. Stop Recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
        setIsListening(false);
    };

    // 3. Process: Deepgram -> Gemini -> TTS
    const processVoiceCommand = async (audioBlob) => {
        setIsProcessing(true);

        try {
            // ---> FIX: Send the raw Blob directly instead of a recreated File object
            const formData = new FormData();
            formData.append("audio", audioBlob, "voice.webm");
            formData.append("language", "en"); 

            console.log("[Assistant] Sending to Deepgram...");
            const transcribeRes = await axios.post("http://localhost:5000/api/voice/transcribe", formData);
            const userText = transcribeRes.data.text || transcribeRes.data.transcript;

            if (!userText || userText.trim() === "(No speech detected)") {
                setChatHistory(prev => [...prev, { sender: "ai", text: "I didn't quite catch that. Could you try speaking a little louder?" }]);
                setIsProcessing(false);
                return;
            }

            // Show user's text on screen
            setChatHistory(prev => [...prev, { sender: "user", text: userText }]);

            // STEP B: Send text to Gemini AI
            console.log("[Assistant] Asking Gemini:", userText);
            const aiRes = await axios.post("http://localhost:5000/api/ai/chat", { message: userText });
            const aiReply = aiRes.data.reply;

            // Show AI text on screen
            setChatHistory(prev => [...prev, { sender: "ai", text: aiReply }]);
            
            // STEP C: Speak the AI Response
            speakText(aiReply);

        } catch (error) {
            console.error("Assistant Error:", error);
            setChatHistory(prev => [...prev, { sender: "ai", text: "⚠️ Sorry, my brain or my ears are having network trouble right now." }]);
        }

        setIsProcessing(false);
    };

    // 4. Robust Text-to-Speech Engine
    const speakText = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        setTimeout(() => {
            window.speechSynthesis.speak(utterance);
        }, 50);
    };

    const toggleAssistant = () => {
        if (isListening) {
            stopRecording();
        } else {
            if (!isOpen) setIsOpen(true);
            startRecording();
        }
    };

    return (
        <div className="sv-assistant-wrapper">
            {isOpen && (
                <div className="sv-assistant-window">
                    <div className="sv-assistant-header">
                        <div className="sv-header-info">
                            <span className="sv-robot-icon">🤖</span>
                            <h3>Smart Assistant</h3>
                        </div>
                        <button className="sv-close-btn" onClick={() => setIsOpen(false)}>✖</button>
                    </div>
                    
                    <div className="sv-chat-body">
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`sv-chat-bubble ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isListening && <div className="sv-status-indicator pulse-red">Recording... Click mic to stop.</div>}
                        {isProcessing && <div className="sv-status-indicator blink">Thinking...</div>}
                        {isSpeaking && <div className="sv-status-indicator text-blue">Speaking...</div>}
                    </div>
                </div>
            )}

            <button 
                className={`sv-floating-btn ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''} ${isProcessing ? 'processing' : ''}`}
                onClick={toggleAssistant}
            >
                {isProcessing ? "⏳" : isListening ? "🛑" : isSpeaking ? "🔊" : "🎤"}
            </button>

            <style>{`
                .sv-assistant-wrapper {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    z-index: 999999;
                    font-family: 'Sora', sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    pointer-events: none;
                }
                .sv-assistant-wrapper > * { pointer-events: auto; }
                .sv-floating-btn {
                    width: 65px;
                    height: 65px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #4a8e38, #2d5a27);
                    color: white;
                    font-size: 28px;
                    border: none;
                    box-shadow: 0 8px 24px rgba(74, 142, 56, 0.4);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                    margin-top: 15px;
                }
                .sv-floating-btn.listening { background: #e05252; animation: sv-pulse-red 1.5s infinite; }
                .sv-floating-btn.processing { background: #f39c12; }
                .sv-floating-btn.speaking { background: #3d72d4; animation: sv-pulse-blue 1.5s infinite; }
                .sv-assistant-window {
                    width: 320px;
                    height: 420px;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                    margin-bottom: 20px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid #e8ede7;
                }
                .sv-assistant-header { background: linear-gradient(135deg, #1a3a1a, #2d5a27); color: white; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; }
                .sv-header-info { display: flex; align-items: center; gap: 10px; }
                .sv-header-info h3 { margin: 0; font-size: 15px; font-weight: 600; }
                .sv-close-btn { background: transparent; border: none; color: white; cursor: pointer; font-size: 14px; opacity: 0.7; }
                .sv-chat-body { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background: #f8faf7; scroll-behavior: smooth; }
                .sv-chat-bubble { padding: 12px 16px; border-radius: 14px; font-size: 13.5px; line-height: 1.5; max-width: 85%; }
                .sv-chat-bubble.ai { background: white; color: #1a2e18; border: 1px solid #e8ede7; align-self: flex-start; border-bottom-left-radius: 4px; }
                .sv-chat-bubble.user { background: #e8f0eb; color: #2d5a27; align-self: flex-end; border-bottom-right-radius: 4px; font-weight: 500; }
                .sv-status-indicator { font-size: 11px; align-self: flex-start; font-weight: 600; margin-top: 4px;}
                .pulse-red { color: #e05252; animation: sv-fade 1s infinite; }
                .text-blue { color: #3d72d4; }
                .blink { color: #f39c12; animation: sv-fade 1s infinite; }
                @keyframes sv-pulse-red { 0% { box-shadow: 0 0 0 0 rgba(224, 82, 82, 0.6); } 70% { box-shadow: 0 0 0 15px rgba(224, 82, 82, 0); } 100% { box-shadow: 0 0 0 0 rgba(224, 82, 82, 0); } }
                @keyframes sv-pulse-blue { 0% { box-shadow: 0 0 0 0 rgba(61, 114, 212, 0.6); } 70% { box-shadow: 0 0 0 15px rgba(61, 114, 212, 0); } 100% { box-shadow: 0 0 0 0 rgba(61, 114, 212, 0); } }
                @keyframes sv-fade { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
            `}</style>
        </div>
    );
}