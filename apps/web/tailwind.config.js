/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@sovryn/tailwindcss-config/index.js")],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
};
