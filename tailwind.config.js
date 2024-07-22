module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      textShadow: {
        default: "0 2px 5px rgba(0, 0, 0, 0.5)",
        lg: "0 2px 10px rgba(0, 0, 0, 0.5)",
      },
      scale: {
        130: "1.3",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%) scale(1)" },
          "100%": { transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.5s ease-out forwards",
      },
    },
  },
  variants: {
    extend: {
      scale: ["hover", "group-hover"],
    },
  },
  plugins: [
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") }
      );
    },
  ],
};
