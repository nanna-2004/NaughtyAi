// tailwind.config.js
module.exports = {
  darkMode: "class", // For class-based dark mode
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "text-white",
    "text-yellow-400",
    "text-green-500",
    "text-blue-500",
    "text-red-500",
    "text-transparent",
    "bg-clip-text",
    "font-mono",
    "font-bold",
    "font-semibold",
    "font-extrabold",
    "shadow-md",
    "text-xl",
    "text-2xl",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
