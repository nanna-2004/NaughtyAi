// app/api/public-images/route.js
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin"; // Assuming adminDb is correctly initialized

export async function GET() {
  try {
    // Query Firestore for images that are marked as public and completed
    const publicImagesQuery = await adminDb.collection("images")
      .where("isPublic", "==", true)
      .where("status", "==", "completed")
      .orderBy("createdAt", "desc") // Order by creation date, newest first
      .get();

    const publicImages = publicImagesQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Timestamp to a more friendly format if needed, e.g., for display
      createdAt: doc.data().createdAt ? doc.data().createdAt.toDate().toISOString() : null,
    }));

    return NextResponse.json(publicImages);

  } catch (error) {
    // --- ENHANCED ERROR LOGGING ---
    console.error("Error fetching public images in API route:", error);
    // Return a more descriptive error message to the client (optional, for debugging)
    return new Response(`Internal Server Error: ${error.message || 'Unknown error'}`, { status: 500 });
  }
}
