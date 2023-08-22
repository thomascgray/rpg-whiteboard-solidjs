/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "nasturician-flower": "#e84118",
      },
      animation: {
        'spin-fast': 'spin 0.2s linear infinite',
        'bounce-fast': 'bounce  0.2s linear infinite',
      },
    },
  },
  plugins: [],
};
