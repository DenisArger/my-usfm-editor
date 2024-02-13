/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#323653",
        widget: "#1D1F34",
        hover: "#474A6B",
      },
    },
  },
  plugins: [],
};
