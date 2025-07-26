import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split("Bearer ")[1] : null;
    if (!token) return new Response("Unauthorized", { status: 401 });

    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { videoId, durationInFrames } = await req.json();
    if (!videoId) {
      return new Response("Bad Request: videoId is required", { status: 400 });
    }

    // Get video data from Firestore
    const docRef = adminDb.collection("videos").doc(videoId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return new Response("Video not found", { status: 404 });
    }

    const videoData = docSnap.data();

    // Security Check: Ensure the user owns this video
    if (videoData.uid !== userId) {
      return new Response("Forbidden: You do not have permission to access this video", { status: 403 });
    }

    // Check if video is completed
    if (videoData.status !== "completed") {
      return new Response("Video is not ready for download", { status: 400 });
    }

    // Return video components for download
    return NextResponse.json({ 
      success: true,
      videoData: {
        topic: videoData.topic,
        audioUrl: videoData.audioUrl,
        images: videoData.images || [],
        captions: videoData.captions || [],
        script: videoData.script,
        durationInFrames: videoData.durationInFrames || durationInFrames,
        aspectRatio: videoData.aspectRatio || "16:9"
      },
      downloadReady: true
    });

  } catch (error) {
    console.error("API Error in render-video:", error);
    return NextResponse.json({ error: "Failed to prepare video for download", details: error.message }, { status: 500 });
  }
}
