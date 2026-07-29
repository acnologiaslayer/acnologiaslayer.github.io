/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#08080A",
        surface: "#0F0F12",
        elevated: "#16161A",
        border: "#232329",
        muted: "#8A8A94",
        fg: "#F4F4F6",
        accent: "#6366F1",
        "accent-glow": "#818CF8",
      },
      fontFamily: {
        display: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Archivo", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1152px",
      },
      keyframes: {
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "gradient-pan": "gradient-pan 8s ease infinite",
      },
    },
  },
  plugins: [],
};
