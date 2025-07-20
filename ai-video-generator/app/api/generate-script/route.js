import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin'; // <-- Import Firebase Admin

const MODEL_NAME = 'gemini-1.5-flash-latest';

export async function POST(req) {
  try {
    // --- ADDED: AUTHENTICATION & CREDIT CHECK ---
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split("Bearer ")[1] : null;
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const userDocRef = adminDb.collection("users").doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
        return new Response("User profile not found. Please log in again.", { status: 404 });
    }

    const userData = userDoc.data();
    if (userData.freeProjectsRemaining <= 0) {
        return new Response("No credits remaining. Please buy more credits to generate scripts.", { status: 403 });
    }
    // --- END: AUTHENTICATION & CREDIT CHECK ---

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing Gemini API key');
    }

    const { topic, isForImage } = await req.json();
    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    let promptText;

    if (isForImage) {
      promptText = `
        Generate two distinct, detailed, and visually rich paragraphs that describe a scene for an image based on the topic: "${topic}".
        Do not include any labels like "Scene:" or "Description:".
        Respond ONLY with a valid JSON object in the following format:
        { "scripts": ["A detailed paragraph for the first image option.", "A detailed paragraph for the second image option."] }
      `;
    } else {
      promptText = `
        Create two short video scripts (20-25 seconds each) for the topic: "${topic}".
        For each script, provide a concise voiceover and a list of 3-4 distinct visual scene descriptions.
        Respond ONLY with a valid JSON object in the following format:
        {
          "scripts": [
            { "voiceover": "A complete narration script for the video.", "scenes": ["A description for the first visual scene.", "A description for the second visual scene.", "A description for the third visual scene."] },
            { "voiceover": "A second complete narration script.", "scenes": ["A visual description for the second video's first scene.", "A visual description for the second video's second scene."] }
          ]
        }
      `;
    }
    
    // Enforce JSON output mode to guarantee a reliable response
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      generationConfig: { responseMimeType: "application/json" },
    });
    
    const result = await model.generateContent(promptText);
    const response = await result.response;
    return NextResponse.json(JSON.parse(response.text()));

  } catch (error) {
    console.error('🔥 API Error in generate-script:', error);
    // Handle potential auth errors gracefully
    if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error') {
      return new Response("Unauthorized: Invalid token", { status: 401 });
    }
    return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 });
  }
}