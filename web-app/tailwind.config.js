/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0041C7', 
        primaryDark: '#0160C9',
      }
    },
  },
  plugins: [],
}