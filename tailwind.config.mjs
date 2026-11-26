/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefbf0",
          100: "#d6f5d8",
          200: "#b0ebb4",
          300: "#7dd983",
          400: "#47bd4e",
          500: "#24b829",
          600: "#1D9D21",
          700: "#177e1a",
          800: "#136316",
          900: "#0e4b10",
          950: "#072909",
        },
        forest: {
          800: "#103b13",
          900: "#0b290d",
          950: "#051a06",
        },
        gold: {
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
        },
      },
    },
  },
  plugins: [],
};
