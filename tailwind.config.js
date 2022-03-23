const tailwindcssrtl = require("tailwindcss-rtl");

const colors = require("./src/styles/colors");

module.exports = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/component/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ...colors,
      },
    },
  },
  plugins: [tailwindcssrtl],
};
