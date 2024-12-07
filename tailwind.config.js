/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,css,scss}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      backgroundImage: {
        report: "url('/src/assets/png/Report.png')",
        "linear-gradient":
          "linear-gradient(to right, #660066 33%, #C43E85 66%, #FF6699 100%)",
      },
      boxShadow: {
        "custom-purple": "0 20px 40px rgba(102, 0, 102, 0.1)",
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      },
      colors: {
        "primary-700": "#660066",
        "primary-200": "#C43E85",
        "primary-300": "#006666",
        "primary-400": "#666600",
        "purple-white": "#FFF0FF",
        "purple-pink": "#FFCCFF",
        "purple-deep": "#1F141F",
        "pink-primary": "#FF6699",
        "grey-primary": "#333333",
        "grey-light": "#F7F7F7",
        "error-light": "#FFF0F0",
        error: "#FC0E0E",
        "approve-light": "#F3FBF5",
        approve: "#319F43",
        progress: "#F8BD00",
        completed: "#319F43",
        grey: "#808080",
      },
    },
  },
};
