/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#002D72', // Azul marinho do PayByt
          light: '#1a4285',
          dark: '#001f4f',
        },
        bitcoin: {
          DEFAULT: '#F7931A', // Laranja Bitcoin
          light: '#f9a94d',
          dark: '#d67908',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
