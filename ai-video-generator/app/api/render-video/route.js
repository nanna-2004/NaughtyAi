import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { spawn } from "child_process"; // Import the 'spawn' function

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split("Bearer ")[1] : null;
    if (!token) return new Response("Unauthorized", { status: 401 });

    await adminAuth.verifyIdToken(token);

    const { videoId } = await req.json();
    if (!videoId) {
      return new Response("Bad Request: videoId is required", { status: 400 });
    }

    // --- Start of The Final Fix ---
    // Execute the standalone render script in the background
    const child = spawn('npm', ['run', 'render', '--', videoId], {
      detached: true,
      stdio: 'ignore', // You can change to 'inherit' to see logs in the server console
    });
    child.unref(); // Allow the API route to finish without waiting for the render
    // --- End of The Final Fix ---

    return NextResponse.json({ 
      success: true, 
      message: "Video rendering process has been started in the background. It may take a few minutes." 
    });

  } catch (error) {
    console.error("API Error in render-video:", error);
    return NextResponse.json({ error: "Failed to start render process", details: error.message }, { status: 500 });
  }
}
