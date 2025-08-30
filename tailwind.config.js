/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.tsx"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FFB800',
        'secondary': '#4A4A4A',
        'accent': '#FF6F00',
      },
    },
  },
  plugins: [],
}