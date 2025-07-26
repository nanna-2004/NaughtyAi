import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // This is a placeholder API route for image generation
    // The actual image generation logic is handled by the generate-image-data route
    return NextResponse.json({ 
      message: "Image generation endpoint - please use /api/generate-image-data instead" 
    });
  } catch (error) {
    console.error("Error in generate-image route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
