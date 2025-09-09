/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'academic-blue': '#0A2342',
        'innovation-saffron': '#F9A826',
        'clarity-white': '#FDFEFF',
        'light-gray': '#F7F9FA',
        'success-green': '#16A34A',
        'failure-red': '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
