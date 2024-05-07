/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontSize: {
      xs: "0.6785rem",
      base: ["15px", { lineHeight: "18px" }],
      lg: "19px",
      "2xl": "24px",
      "3xl": "30px",
    },
    extend: {
      colors: {
        primary: {
          100: "#F3FCFC",
          200: "#DCF5F5",
          700: "#289A98",
          950: "#092A29",
        },
      },
    },
  },
  plugins: [],
};
