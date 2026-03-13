/**
 * DEEPGRAM VOICE TRANSCRIPTION SETUP GUIDE
 * ========================================
 * 
 * If you're getting 500 errors on POST /api/voice/transcribe, 
 * follow these steps to diagnose and fix the issue.
 */

// STEP 1: Verify API Key is Valid
// ================================
// Your current API key in .env:
// DEEPGRAM_API_KEY=2c9b310144ce7d6b228b6dfdbc0530e1a508e50c
//
// This key MUST be a valid Deepgram API key from console.deepgram.com
// 
// If you don't have a valid API key:
// 1. Go to https://console.deepgram.com
// 2. Create a free account
// 3. Click "Settings" → "API Keys" 
// 4. Click "Create New API Key"
// 5. Copy the key and update your .env file

// STEP 2: Check Audio Format
// ============================
// Supported audio formats:
// ✓ MP3, WAV, OGG, WebM, FLAC, MP4, M4A
// ✗ Ensure audio is not corrupted
// ✗ Ensure audio is at least a few seconds long
// ✗ Ensure microphone permission is granted in browser

// STEP 3: Verify MongoDB Connection
// ==================================
// MongoDB is required to save transcription logs
// Your MONGO_URI in .env:
// mongodb+srv://SmartVegies:SmartVegies123@god.xrmpxol.mongodb.net/?appName=GOD
//
// Make sure MongoDB is accessible from your network

// STEP 4: Check Server Logs
// ==========================
// When making a transcription request, look at the backend console for:
// 
// ✓ "[Deepgram Service] Starting transcription..."
// ✓ "[Deepgram Service] Transcription completed successfully"
// 
// ✗ If you see "[Deepgram Service] Error: ..."
//   → The error message will tell you what went wrong
// ✗ If you see "401" or "Unauthorized"
//   → Your API key is invalid, get a new one
// ✗ If you see "models not found" or "invalid language"
//   → Try with model: "nova-2" and language: "en"

// STEP 5: Quick Test
// ==================
// Run this command to verify everything is configured:
// 
// cd C:\Users\Hp\Desktop\smartvegies-hack\SmartVegies\backend
// node test-deepgram.js

// STEP 6: Frontend Audio Format
// =============================
// Make sure your VoiceTranscriber.jsx is sending audio in the correct format:
// 
// ✓ File upload: Check MIME type is audio/*
// ✓ Live recording: Ensure createReadStream("path/to/file") works
// ✓ Check browser console for errors before POST request

// TROUBLESHOOTING CHECKLIST
// ========================
// [ ] API key is valid and active on console.deepgram.com
// [ ] .env file has correct DEEPGRAM_API_KEY value
// [ ] Backend server is running on port 5000
// [ ] MongoDB connection is working
// [ ] Audio file is not corrupted
// [ ] Audio file is > 1 second long
// [ ] Browser microphone permissions are granted
// [ ] Check browser network tab for response details

// COMMON ERRORS
// =============
// 
// "Empty response from Deepgram API"
// → Audio might be too short or empty, try speaking for 2+ seconds
//
// "No transcription channels returned"
// → API key might not have transcription permissions
//
// 401 Unauthorized
// → API key is invalid, expired, or has insufficient permissions
//   → Get new key from https://console.deepgram.com
//
// Network timeout
// → Deepgram API unreachable, check internet connection
//
// "Model not found"
// → Change model from "nova-2" to "nova-3" or available model

console.log("📋 Voice Transcription Setup Guide Loaded");
console.log("See this file for troubleshooting help");
