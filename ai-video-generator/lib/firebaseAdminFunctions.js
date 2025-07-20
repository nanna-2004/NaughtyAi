// lib/firebaseAdminFunctions.js
import { admin as firebaseAdmin } from "./firebaseAdmin";

// Define your Admin UID at the top for easy access.
// Make sure this is your correct UID from Firebase Authentication.
const ADMIN_UID = 'LENn41FFYdYPqetJrVDxy6bTluA3'; 

/**
 * Securely deducts one credit from a user's account using the Firebase Admin SDK.
 * This function should only be called from a secure backend environment (like an Inngest function).
 * @param {string} uid - The user's unique ID.
 */
export async function DeductCredit(uid) {
  if (!uid) {
    console.error("DeductCredit error: UID is missing.");
    return;
  }

  // --- NEW: ADMIN CHECK ---
  // If the user is the admin, skip the entire deduction process.
  if (uid === ADMIN_UID) {
    console.log(`✅ [Admin] Admin user detected. Skipping credit deduction.`);
    return; // Exit the function
  }

  // For all other users, the existing credit logic will run.
  const db = firebaseAdmin.firestore();
  const userDocRef = db.collection("users").doc(uid);

  try {
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userDocRef);
      if (!userDoc.exists) {
        throw new Error("User document not found!");
      }

      const userData = userDoc.data();
      // Use your existing field names
      let freeProjects = userData.freeProjectsRemaining || 0; 
      let paidCredits = userData.paidCredits || 0; // Assuming the paid credits field is named this

      if (freeProjects > 0) {
        transaction.update(userDocRef, { freeProjectsRemaining: freeProjects - 1 });
        console.log(`✅ [Admin] Deducted 1 free credit from user ${uid}.`);
      } else if (paidCredits > 0) {
        transaction.update(userDocRef, { paidCredits: paidCredits - 1 });
        console.log(`✅ [Admin] Deducted 1 paid credit from user ${uid}.`);
      } else {
        throw new Error("Insufficient credits.");
      }
    });
  } catch (error) {
    console.error(`[Admin] Failed to deduct credit for user ${uid}:`, error);
    throw error;
  }
}