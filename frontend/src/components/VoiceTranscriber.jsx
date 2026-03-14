import { useState, useRef, useEffect } from "react";
import axios from "axios";

const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    // { code: "ur", label: "Urdu" },
    // { code: "pa", label: "Punjabi" },
    { code: "mr", label: "Marathi" },
];

const MAX_FILE_MB = 25;

export default function VoiceTranscriber() {
    const [mode, setMode] = useState("upload"); // "upload" | "record"
    const [language, setLanguage] = useState("en");
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("idle"); // idle | recording | loading | done | error
    const [transcript, setTranscript] = useState("");
    const [meta, setMeta] = useState(null);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [recordingLevel, setRecordingLevel] = useState(0); // For audio visualization

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const fileInputRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyzerRef = useRef(null);
    const animationIdRef = useRef(null);

    // ── File upload handler ────────────────────────────────────────────────────
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        if (selected.size > MAX_FILE_MB * 1024 * 1024) {
            setError(`File too large. Maximum size is ${MAX_FILE_MB} MB.`);
            return;
        }
        setFile(selected);
        setError("");
        setTranscript("");
        setMeta(null);
    };

    // ── Recording handlers ─────────────────────────────────────────────────────
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioChunksRef.current = [];

            // Setup audio analysis for visualization
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyzer = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyzer);
            analyzer.fftSize = 2048;

            audioContextRef.current = audioContext;
            analyzerRef.current = analyzer;

            // Let the browser pick its most stable default audio format
            const recorder = new MediaRecorder(stream);

            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            recorder.onstop = () => {
                // Create one solid, uncorrupted audio file using the browser's native mimeType
                const safeMimeType = recorder.mimeType || 'audio/webm';
                const extension = safeMimeType.includes('mp4') ? 'mp4' : 'webm';
                
                const blob = new Blob(audioChunksRef.current, { type: safeMimeType });
                const recordedFile = new File([blob], `live-recording-${Date.now()}.${extension}`, {
                    type: safeMimeType,
                });
                
                setFile(recordedFile);
                stream.getTracks().forEach((t) => t.stop());

                // Stop audio level visualization
                if (animationIdRef.current) {
                    cancelAnimationFrame(animationIdRef.current);
                }
                setRecordingLevel(0);
            };

            mediaRecorderRef.current = recorder;
            
            // Start recording in one continuous block (fixes corruption issues)
            recorder.start(); 
            
            setStatus("recording");
            setError("");

            // Update recording level visualization
            const updateLevel = () => {
                const dataArray = new Uint8Array(analyzer.frequencyBinCount);
                analyzer.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                setRecordingLevel(Math.min(100, (average / 255) * 100));
                animationIdRef.current = requestAnimationFrame(updateLevel);
            };
            updateLevel();

        } catch (err) {
            console.error("[VoiceTranscriber] Microphone error:", err.message);
            setError("Microphone access denied or browser incompatible. Please check permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
        setStatus("idle");
        if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
        }
        if (audioContextRef.current && audioContextRef.current.state !== "closed") {
            audioContextRef.current.close();
        }
    };

    // ── Submit to API ──────────────────────────────────────────────────────────
    const handleTranscribe = async () => {
        if (!file) {
            setError("Please select or record an audio file first.");
            return;
        }

        const formData = new FormData();
        formData.append("audio", file);
        formData.append("language", language);

        try {
            setStatus("loading");
            setError("");
            setTranscript("");

            console.log("[VoiceTranscriber] Sending POST request to /api/voice/transcribe");
            console.log("[VoiceTranscriber] File:", file.name, "| Size:", (file.size / 1024 / 1024).toFixed(2), "MB");

            // Axios automatically handles FormData and sets correct Content-Type
            const response = await axios.post(
                "http://localhost:5000/api/voice/transcribe",
                formData
            );

            console.log("[VoiceTranscriber] Response received:", response.status);

            const { data } = response;

            // We intelligently check for the transcript wherever the backend put it
            const finalTranscript = data?.text || data?.transcript || data?.data?.transcript;

            if (!finalTranscript) {
                throw new Error("Invalid response format from server");
            }

            setTranscript(finalTranscript);
            setMeta({
                confidence: data?.confidence || data?.data?.confidence,
                duration: data?.duration || data?.data?.duration,
                wordCount: data?.wordCount || data?.data?.wordCount,
            });
            
            setStatus("done");
            console.log("[VoiceTranscriber] Transcription complete");

        } catch (err) {
            console.error("[VoiceTranscriber] Error:", err.message);
            
            let errorMessage = "Transcription failed. Please try again.";

            if (err.response?.status === 422) {
                errorMessage = err?.response?.data?.message || "No speech detected. Please record clear speech and try again.";
            } else if (err.response?.status === 400) {
                errorMessage = "Invalid file. Please upload a valid audio file.";
            } else if (err.response?.status === 500) {
                errorMessage = "Server error. Please try again later.";
            } else {
                errorMessage = err?.response?.data?.message || err?.message || errorMessage;
            }

            setError(errorMessage);
            setStatus("error");
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(transcript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setFile(null);
        setTranscript("");
        setMeta(null);
        setStatus("idle");
        setError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="voice-transcriber">
            <div className="vt-header">
                <span className="vt-icon">🎙️</span>
                <div>
                    <h2 className="vt-title">Voice to Text</h2>
                    <p className="vt-subtitle">
                        Upload or record audio — get an accurate transcript instantly
                    </p>
                </div>
            </div>

            {/* Mode Toggle */}
            <div className="vt-toggle">
                <button
                    className={`vt-tab ${mode === "upload" ? "active" : ""}`}
                    onClick={() => { setMode("upload"); handleReset(); }}
                >
                    📂 Upload File
                </button>
                <button
                    className={`vt-tab ${mode === "record" ? "active" : ""}`}
                    onClick={() => { setMode("record"); handleReset(); }}
                >
                    🎤 Record Live
                </button>
            </div>

            {/* Language Selector */}
            <div className="vt-field">
                <label className="vt-label">Language</label>
                <select
                    className="vt-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                </select>
            </div>

            {/* Input Area */}
            {mode === "upload" ? (
                <div
                    className="vt-dropzone"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        hidden
                        onChange={handleFileChange}
                    />
                    {file ? (
                        <div className="vt-file-info">
                            <span className="vt-file-icon">🎵</span>
                            <span className="vt-file-name">{file.name}</span>
                            <span className="vt-file-size">
                                ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                            </span>
                        </div>
                    ) : (
                        <div className="vt-dropzone-empty">
                            <span className="vt-dz-icon">⬆️</span>
                            <p>Click to choose an audio file</p>
                            <small>MP3, WAV, OGG, WebM, FLAC — max 25 MB</small>
                        </div>
                    )}
                </div>
            ) : (
                <div className="vt-recorder">
                    {status === "recording" ? (
                        <div>
                            <button className="vt-rec-btn stop" onClick={stopRecording}>
                                <span className="rec-dot" /> Stop Recording
                            </button>
                            <div className="vt-recording-level">
                                <p className="vt-level-label">Audio Level</p>
                                <div className="vt-level-bar-container">
                                    <div
                                        className="vt-level-bar"
                                        style={{ width: `${recordingLevel}%` }}
                                    />
                                </div>
                                <p className="vt-level-hint">
                                    {recordingLevel < 5 && "🔇 No sound detected - speak louder"}
                                    {recordingLevel >= 5 && recordingLevel < 30 && "🔉 Quiet - try speaking closer to microphone"}
                                    {recordingLevel >= 30 && "🔊 Good level - keep speaking!"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <button
                            className="vt-rec-btn start"
                            onClick={startRecording}
                            disabled={status === "loading"}
                        >
                            🎤 Start Recording
                        </button>
                    )}
                    {file && status !== "recording" && (
                        <p className="vt-rec-ready">✅ Recording ready: {file.name}</p>
                    )}
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="vt-error-container">
                    <p className="vt-error">⚠️ {error}</p>
                    {error.includes("No speech detected") && (
                        <div className="vt-suggestions">
                            <p><strong>Tips for better results:</strong></p>
                            <ul>
                                <li>Speak clearly and at a normal volume</li>
                                <li>Minimize background noise</li>
                                <li>Record at least 1-2 seconds of continuous speech</li>
                                <li>Try using WAV or MP3 format instead of WebM</li>
                                <li>Ensure selected language matches your speech</li>
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Submit */}
            <button
                className="vt-submit"
                onClick={handleTranscribe}
                disabled={!file || status === "loading" || status === "recording"}
            >
                {status === "loading" ? (
                    <><span className="spinner" /> Transcribing…</>
                ) : (
                    "Transcribe Audio"
                )}
            </button>

            {/* Result */}
            {status === "done" && transcript && (
                <div className="vt-result">
                    <div className="vt-result-header">
                        <span className="vt-result-title">📝 Transcript</span>
                        <div className="vt-result-actions">
                            <button className="vt-action-btn" onClick={handleCopy}>
                                {copied ? "✅ Copied!" : "📋 Copy"}
                            </button>
                            <button className="vt-action-btn secondary" onClick={handleReset}>
                                🔄 New
                            </button>
                        </div>
                    </div>

                    <div className="vt-transcript-box">{transcript}</div>

                    {meta && (
                        <div className="vt-meta">
                            {meta.confidence != null && (
                                <span>Confidence: {(meta.confidence * 100).toFixed(1)}%</span>
                            )}
                            {meta.duration != null && (
                                <span>Duration: {meta.duration.toFixed(1)}s</span>
                            )}
                            {meta.wordCount != null && (
                                <span>Words: {meta.wordCount}</span>
                            )}
                        </div>
                    )}
                </div>
            )}

            <style>{`
        .voice-transcriber {
          background: #fff;
          border-radius: 16px;
          padding: 28px;
          max-width: 640px;
          margin: 0 auto;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          font-family: 'Segoe UI', sans-serif;
        }
        .vt-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
        .vt-icon { font-size: 2rem; }
        .vt-title { margin: 0; font-size: 1.4rem; font-weight: 700; color: #1a2e1a; }
        .vt-subtitle { margin: 2px 0 0; font-size: 0.85rem; color: #666; }
        .vt-toggle { display: flex; gap: 8px; margin-bottom: 20px; background: #f5f7f5; border-radius: 10px; padding: 4px; }
        .vt-tab { flex: 1; padding: 9px; border: none; background: transparent; border-radius: 8px; cursor: pointer; font-size: 0.88rem; font-weight: 500; color: #555; transition: all 0.2s; }
        .vt-tab.active { background: #fff; color: #2d7a2d; box-shadow: 0 1px 6px rgba(0,0,0,0.1); font-weight: 600; }
        .vt-field { margin-bottom: 16px; }
        .vt-label { display: block; font-size: 0.82rem; font-weight: 600; color: #444; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
        .vt-select { width: 100%; padding: 10px 14px; border: 1.5px solid #ddd; border-radius: 8px; font-size: 0.92rem; background: #fafafa; outline: none; cursor: pointer; }
        .vt-select:focus { border-color: #2d7a2d; }
        .vt-dropzone { border: 2px dashed #c8d8c8; border-radius: 12px; padding: 32px 20px; text-align: center; cursor: pointer; transition: border-color 0.2s, background 0.2s; margin-bottom: 16px; }
        .vt-dropzone:hover { border-color: #2d7a2d; background: #f5fbf5; }
        .vt-dropzone-empty p { margin: 8px 0 4px; color: #555; font-size: 0.93rem; }
        .vt-dropzone-empty small { color: #999; font-size: 0.8rem; }
        .vt-dz-icon { font-size: 2rem; }
        .vt-file-info { display: flex; align-items: center; gap: 8px; justify-content: center; flex-wrap: wrap; }
        .vt-file-icon { font-size: 1.5rem; }
        .vt-file-name { font-weight: 600; color: #1a2e1a; font-size: 0.9rem; }
        .vt-file-size { color: #888; font-size: 0.82rem; }
        .vt-recorder { text-align: center; margin-bottom: 16px; }
        .vt-rec-btn { padding: 12px 28px; border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .vt-rec-btn.start { background: #2d7a2d; color: #fff; }
        .vt-rec-btn.start:hover { background: #236023; }
        .vt-rec-btn.stop { background: #c0392b; color: #fff; display: flex; align-items: center; gap: 8px; margin: 0 auto; }
        .rec-dot { width: 10px; height: 10px; background: #fff; border-radius: 50%; animation: blink 1s infinite; }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.2; } }
        .vt-rec-ready { color: #2d7a2d; font-size: 0.87rem; margin-top: 10px; }
        .vt-recording-level { margin-top: 16px; }
        .vt-level-label { font-size: 0.85rem; font-weight: 600; color: #1a2e1a; margin: 0 0 8px 0; }
        .vt-level-bar-container { width: 100%; height: 24px; background: #e8ede8; border-radius: 8px; overflow: hidden; margin-bottom: 8px; border: 1px solid #d0e0d0; }
        .vt-level-bar { height: 100%; background: linear-gradient(90deg, #2d7a2d 0%, #4da24d 100%); border-radius: 8px; transition: width 0.1s linear; }
        .vt-level-hint { font-size: 0.78rem; color: #666; margin: 0; }
        .vt-error { color: #c0392b; background: #fdf0f0; border: 1px solid #f5c6c6; border-radius: 8px; padding: 10px 14px; font-size: 0.88rem; margin-bottom: 12px; }
        .vt-error-container { margin-bottom: 12px; }
        .vt-suggestions { background: #f0f8f5; border-left: 3px solid #2d7a2d; padding: 12px 14px; border-radius: 6px; margin-top: 8px; font-size: 0.82rem; }
        .vt-suggestions p { margin: 0 0 8px 0; font-weight: 600; color: #1a2e1a; }
        .vt-suggestions ul { margin: 0; padding-left: 18px; }
        .vt-suggestions li { margin: 4px 0; color: #333; }
        .vt-submit { width: 100%; padding: 13px; background: #2d7a2d; color: #fff; border: none; border-radius: 10px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .vt-submit:hover:not(:disabled) { background: #236023; }
        .vt-submit:disabled { background: #a0c0a0; cursor: not-allowed; }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .vt-result { margin-top: 24px; border: 1.5px solid #d0e8d0; border-radius: 12px; overflow: hidden; }
        .vt-result-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #f0f9f0; border-bottom: 1px solid #d0e8d0; }
        .vt-result-title { font-weight: 700; color: #1a2e1a; font-size: 0.92rem; }
        .vt-result-actions { display: flex; gap: 8px; }
        .vt-action-btn { padding: 6px 14px; border-radius: 6px; border: none; font-size: 0.82rem; font-weight: 600; cursor: pointer; background: #2d7a2d; color: #fff; transition: background 0.2s; }
        .vt-action-btn:hover { background: #236023; }
        .vt-action-btn.secondary { background: #e0e0e0; color: #333; }
        .vt-action-btn.secondary:hover { background: #ccc; }
        .vt-transcript-box { padding: 16px; font-size: 0.97rem; line-height: 1.7; color: #222; white-space: pre-wrap; word-break: break-word; max-height: 260px; overflow-y: auto; }
        .vt-meta { display: flex; gap: 16px; flex-wrap: wrap; padding: 10px 16px; background: #f8faf8; border-top: 1px solid #e0ece0; font-size: 0.8rem; color: #666; }
      `}</style>
        </div>
    );
}