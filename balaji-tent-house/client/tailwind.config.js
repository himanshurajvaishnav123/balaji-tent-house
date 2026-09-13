/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: "#6B1220",
          dark: "#4A0C16",
          light: "#8A1B2C",
        },
        marigold: {
          DEFAULT: "#E8A33D",
          dark: "#C7842A",
          light: "#F2C177",
        },
        brass: {
          DEFAULT: "#B8862F",
        },
        ivory: {
          DEFAULT: "#FBF6EC",
        },
        charcoal: {
          DEFAULT: "#241A15",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "drape-pattern":
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 40px)",
      },
    },
  },
  plugins: [],
};
