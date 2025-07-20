// app/api/generate-signed-url/route.js
import { NextResponse } from "next/server";
import { bucket } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { filePath } = await req.json(); // e.g. audio/123456.mp3

    const file = bucket.file(filePath);

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Signed URL Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
