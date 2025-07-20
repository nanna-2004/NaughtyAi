import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    // 1. Authenticate the user on the server
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split("Bearer ")[1] : null;

    if (!token) {
      return new Response("Unauthorized: No token provided", { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // 2. Get the videoId from the request
    const { videoId } = await req.json();
    if (!videoId) {
      return new Response("Bad Request: videoId is required", { status: 400 });
    }

    // 3. Fetch the document using the Admin SDK
    const docRef = adminDb.collection("videos").doc(videoId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return new Response("Not Found", { status: 404 });
    }

    const videoData = docSnap.data();

    // 4. Security Check: Ensure the user requesting the data is the owner
    if (videoData.uid !== userId) {
      return new Response("Forbidden: You do not have permission to view this video", { status: 403 });
    }

    // 5. Return the data to the browser
    return NextResponse.json(videoData);

  } catch (error) {
    console.error("API Error in get-video-data:", error);
    if (error.code === 'auth/id-token-expired') {
        return new Response("Unauthorized: Token expired", { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to fetch video data", details: error.message },
      { status: 500 }
    );
  }
}
