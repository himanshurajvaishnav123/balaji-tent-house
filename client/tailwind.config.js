/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fcf4f4',
          100: '#f7e3e3',
          200: '#efcdcd',
          300: '#e1a7a7',
          400: '#cd7373',
          500: '#b44a4a',
          600: '#9b3636',
          700: '#832a2a',
          800: '#6d2424',
          900: '#5c2222',
          950: '#340e0e',
          DEFAULT: '#800000',
        },
        gold: {
          50: '#fdfbf2',
          100: '#faf4df',
          200: '#f3e6b7',
          300: '#ebd288',
          400: '#e2bc59',
          500: '#D4AF37',
          600: '#bd962c',
          700: '#967123',
          800: '#795a22',
          900: '#654b20',
          950: '#3a280e',
          DEFAULT: '#D4AF37',
        },
      },
      boxShadow: {
        'festive': '0 10px 25px -5px rgba(128, 0, 0, 0.25), 0 8px 10px -6px rgba(212, 175, 55, 0.2)',
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.35)',
      },
    },
  },
  plugins: [],
}
