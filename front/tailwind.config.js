/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'task-important-urgent': '#FF6B6B',     // Red
        'task-important-not-urgent': '#4ECDC4', // Green/Teal
        'task-not-important-urgent': '#FFA500', // Orange
        'task-not-important-not-urgent': '#A9A9A9', // Gray
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

