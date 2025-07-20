"use client";

import { useState, useEffect, useContext } from "react";
import { ThemeProvider } from "next-themes";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/Configs/firebaseConfig";
import { AuthContext } from "@/app/_components/AuthContext";

export default function Provider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          pictureURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <AuthContext.Provider value={{ user }}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

// Custom hook
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContext.Provider");
  }
  return context;
};
