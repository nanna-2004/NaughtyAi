import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
let app;
if (!getApps().length) {
  app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-video-generator-51bc4.firebaseapp.com",
  databaseURL: "https://ai-video-generator-51bc4-default-rtdb.firebaseio.com",
  projectId: "ai-video-generator-51bc4",
  storageBucket: "ai-video-generator-51bc4.appspot.com",
  messagingSenderId: "20251031508",
  appId: "1:20251031508:web:21e8eafa48c13be5be8841",
  measurementId: "G-0LTZPDCYGG",
 });
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

