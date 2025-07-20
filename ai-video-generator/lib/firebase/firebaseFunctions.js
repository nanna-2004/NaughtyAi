// lib/firebase/firebaseFunctions.js

// THE FIX: The import path now correctly points to the parent directory.
import { admin as firebaseAdmin } from "../firebaseAdmin"; 

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

  const db = firebaseAdmin.firestore();
  const userDocRef = db.collection("users").doc(uid);

  try {
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userDocRef);
      if (!userDoc.exists) {
        throw new Error("User document not found!");
      }

      const userData = userDoc.data();
      let freeProjects = userData.freeProjectsRemaining || 0;
      let paidCredits = userData.credits || 0;

      if (freeProjects > 0) {
        transaction.update(userDocRef, { freeProjectsRemaining: freeProjects - 1 });
        console.log(`✅ [Admin] Deducted 1 free credit from user ${uid}.`);
      } else if (paidCredits > 0) {
        transaction.update(userDocRef, { credits: paidCredits - 1 });
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
