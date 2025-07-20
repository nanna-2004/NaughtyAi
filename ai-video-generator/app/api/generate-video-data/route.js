import { inngest } from "@/inngest/client";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // --- COMMON AUTHENTICATION ---
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split("Bearer ")[1] : null;
    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const body = await req.json();

    const { topic, script, videoStyle, voice, captionStyle } = body;
    if (!topic || !script || !videoStyle || !voice || !captionStyle) {
      return new Response("Invalid input for generating a video", { status: 400 });
    }

    // --- CRITICAL FIX: Check user credits before generating ---
    const userDocRef = adminDb.collection("users").doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return new Response("User profile not found. Please log in again.", { status: 404 });
    }

    const userData = userDoc.data();
    if (userData.freeProjectsRemaining <= 0) {
      // Return 403 Forbidden with a clear message if no credits
      return new Response("No credits remaining. Please buy more credits to generate videos.", { status: 403 });
    }
    // --- END CRITICAL FIX ---

    const videoData = {
      uid: userId,
      topic,
      script,
      videoStyle,
      voice,
      captionStyle,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    };
    const docRef = await adminDb.collection("videos").add(videoData);
    const recordID = docRef.id;

    // Send the job to Inngest
    await inngest.send({
      name: "generate-video-data",
      data: {
        script,
        videoStyle,
        voice,
        uid: userId, // Pass userId to Inngest for credit deduction
        recordID,
      },
    });

    return NextResponse.json({ success: true, recordID });

  } catch (error) {
    console.error("Error in generate-video-data API:", error);
    if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error') {
      return new Response("Unauthorized: Invalid token", { status: 401 });
    }
    // For other errors, return a generic 500
    return new Response("Internal Server Error", { status: 500 });
  }
}