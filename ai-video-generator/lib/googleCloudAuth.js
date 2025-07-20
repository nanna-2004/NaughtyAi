// lib/googleCloudAuth.js
import fs from 'fs';
import os from 'os';
import path from 'path';

/**
 * Ensures that Google Cloud credentials are set up for server-side SDKs.
 * This is the most robust way to handle authentication in a serverless environment.
 * It writes the service account key from environment variables to a temporary
 * file and sets the GOOGLE_APPLICATION_CREDENTIALS environment variable, which
 * all Google Cloud libraries automatically detect.
 */
export function setupGoogleCloudCredentials() {
  // Only run this setup once to avoid re-writing the file on every hot-reload
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_SET) {
    return;
  }

  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccount) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.");
    }

    // Create a temporary file path that is unique to this process
    const credentialsPath = path.join(os.tmpdir(), `gcloud-credentials-${process.pid}.json`);
    
    // Write the credentials from the .env.local file to this temporary file
    fs.writeFileSync(credentialsPath, serviceAccount);
    
    // Set the environment variable that all Google Cloud SDKs look for
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
    
    // Mark that we've completed the setup
    process.env.GOOGLE_APPLICATION_CREDENTIALS_SET = 'true';
    
    console.log(`✅ Google Cloud credentials set up successfully.`);

  } catch (error) {
    console.error("❌ CRITICAL ERROR: Failed to set up Google Cloud credentials.", error);
    // This will prevent the app from starting if auth is broken
    throw error;
  }
}
