// app/_components/Authentication.jsx

"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../Configs/firebaseConfig";

export default function Authentication({ children }) {
  const provider = new GoogleAuthProvider();

  const onSignInClick = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return (
    <div onClick={onSignInClick} style={{ cursor: "pointer" }}>
      {children}
    </div>
  );
}
