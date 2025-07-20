// lib/firestore/CreateInitialVideoRecord.js
import { admin as firebaseAdmin } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore"; // Import FieldValue for server-side timestamps

/**
 * Creates the initial placeholder document for a video using the secure Admin SDK.
 */
export async function CreateInitialVideoRecord(uid, topic, script, videoStyle, voice, captionStyle) {
  try {
    // THE FIX: Use the Admin SDK for secure, server-side database writes.
    const db = firebaseAdmin.firestore();
    const videosCollectionRef = db.collection("videos");

    const newDocRef = await videosCollectionRef.add({
      uid,
      topic,
      script,
      videoStyle,
      voice,
      captionStyle,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(), // Use the Admin SDK's server timestamp
      audioUrl: null,
      images: [],
      captions: [],
    });

    console.log(`✅ [Admin] Initial VIDEO record created with ID: ${newDocRef.id}`);
    return newDocRef.id;

  } catch (error) {
    console.error("❌ [Admin] Error creating initial video record:", error);
    return null; 
  }
}
