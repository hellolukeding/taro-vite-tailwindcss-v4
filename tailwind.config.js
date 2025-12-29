/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "theme-primary": "#ff6666",
        "theme-secondary": "#ff9966",
        "theme-tertiary": "#ffcc66",
      },
    },
  },
  plugins: [],
};
