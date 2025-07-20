// app/_components/ThemeSwitcher.jsx

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => setMounted(true), []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div ref={menuRef} style={{ position: "relative", cursor: "pointer" }}>
      <span
        onClick={() => setOpen(!open)}
        title="Theme Settings"
        style={{ fontSize: "1.5rem" }}
      >
        ⚙️
      </span>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "2rem",
            right: 0,
            backgroundColor: "transparent",
            border: "1px solid currentColor",
            borderRadius: "6px",
            padding: "0.5rem 1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            zIndex: 10,
            minWidth: "100px",
          }}
        >
          {[
            { name: "Light", icon: "🌞", value: "light" },
            { name: "Dark", icon: "🌙", value: "dark" },
            { name: "System", icon: "🌍", value: "system" },
          ].map((item) => {
            const isSelected = theme === item.value;
            return (
              <span
                key={item.value}
                onClick={() => {
                  setTheme(item.value);
                  setOpen(false);
                }}
                style={{
                  opacity: isSelected ? 1 : 0.6,
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: isDark ? "white" : "#111",
                  transition: "all 0.3s ease",
                }}
                title={`${item.name} Theme`}
              >
                {item.icon} {item.name}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
