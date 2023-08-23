/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "nasturician-flower": "#e84118",
      },
      animation: {
        // we have different versions of the same thing to give variety
        'spin-fast': 'spin 0.4s linear infinite',
        'spin-fast-1': 'spin 0.2s linear infinite',
        'spin-fast-2': 'spin 0.3s linear infinite',
        'spin-fast-3': 'spin 0.4s linear infinite',
        'spin-fast-4': 'spin 0.5s linear infinite',
        'spin-fast-5': 'spin 0.6s linear infinite',
        'bounce-fast': 'bounce  0.2s linear infinite',
      },
    },
  },
  plugins: [],
};
