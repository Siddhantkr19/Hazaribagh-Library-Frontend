/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // darkMode: 'class', <--- REMOVE THIS LINE (Handled in CSS now)
  theme: {
    extend: {},
  },
  plugins: [],
}