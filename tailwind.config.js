module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '2': 'repeat(2, minmax(0, 1fr))',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    "data-[state=checked]:translate-x-5",
    "data-[state=unchecked]:translate-x-0",
    "data-[state=checked]:bg-emerald-500",
    "data-[state=unchecked]:bg-gray-300",
  ],
};