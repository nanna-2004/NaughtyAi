"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./AuthContext";
import Header from "./Header";

export default function ClientProviders({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // 🔥 prevent hydration mismatch

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <Header />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
