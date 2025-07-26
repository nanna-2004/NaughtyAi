// lib/firebaseAdmin.js
import admin from "firebase-admin";

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
  // Ensure the service account key is available
  if (!serviceAccountKey) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set in .env.local");
  }

  try {
    const parsedServiceAccount = JSON.parse(serviceAccountKey);

    // --- START: THE FINAL FIX ---
    // The error "Invalid PEM formatted message" happens because the `\n` characters
    // in the private key are not being parsed correctly from the .env file. 
    // This line of code explicitly replaces the escaped `\\n` characters with 
    // actual newline characters, which is what the Firebase Admin SDK expects.
    if (parsedServiceAccount.private_key) {
      parsedServiceAccount.private_key = parsedServiceAccount.private_key.replace(/\\n/g, '\n');
    }
    // --- END: THE FINAL FIX ---

    admin.initializeApp({
      credential: admin.credential.cert(parsedServiceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
    
  } catch (error) {
    console.error("Firebase Admin initialization error:", error.message);
    throw new Error("Could not initialize Firebase Admin SDK. Please check your FIREBASE_SERVICE_ACCOUNT_KEY in .env.local");
  }
}

// Initialize and export all the admin services we need
const adminAuth = admin.auth();
const adminDb = admin.firestore();
const adminStorage = admin.storage();
const bucket = adminStorage.bucket();

export { admin, adminAuth, adminDb, adminStorage, bucket };
