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

    // --- LOGIC 1: GET EXISTING IMAGE DATA ---
    if (body.imageId) {
      const { imageId } = body;
      const docRef = adminDb.collection("images").doc(imageId);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return new Response("Image not found", { status: 404 });
      }

      const imageData = docSnap.data();

      if (imageData.uid !== userId) {
        return new Response("Forbidden: You do not have permission.", { status: 403 });
      }

      return NextResponse.json(imageData);
    }

    // --- LOGIC 2: GENERATE NEW IMAGE ---
    const { topic, script, selectImageStyle } = body;
    if (!topic || !script || !selectImageStyle) {
      return new Response("Invalid input for generating an image", { status: 400 });
    }

    // --- CRITICAL FIX: Check user credits before generating ---
    const userDocRef = adminDb.collection("users").doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return new Response("User profile not found. Please log in again.", { status: 404 });
    }

    const userData = userDoc.data();
    if (userData.freeProjectsRemaining <= 0) {
      return new Response("No credits remaining. Please buy more credits to generate images.", { status: 403 });
    }
    // --- END CRITICAL FIX ---

    const imageData = {
      uid: userId,
      topic,
      prompt: script,
      style: selectImageStyle,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    };
    const docRef = await adminDb.collection("images").add(imageData);
    const recordID = docRef.id;

    // Send the job to Inngest
    await inngest.send({
      name: "generate-image-data",
      data: {
        prompt: script,
        selectImageStyle,
        uid: userId, // Pass userId to Inngest for credit deduction
        recordID,
      },
    });

    return NextResponse.json({ success: true, recordID });

  } catch (error) {
    console.error("Error in unified image API:", error);
    if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error') {
      return new Response("Unauthorized: Invalid token", { status: 401 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
}