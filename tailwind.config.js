/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}", // 👈 Important: this scans your app folder
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "acmec-red": "#a7150b",
        "acmec-yellow": "#ffc107",
        "acmec-orange": "#fd580b",
      },
      fontFamily: {
        notosans: ["Noto Sans Tamil", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
