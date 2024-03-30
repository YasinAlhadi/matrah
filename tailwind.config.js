/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{html,js, jsx, ts, tsx}",
    "./components/**/*.{html,js, jsx, ts, tsx}",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

