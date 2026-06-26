import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#4F8EF7",
          mint: "#7ED6C2",
          orange: "#FFB4A2",
          warm: "#FFF7E8",
          "blue-dark": "#3B6FD4",
          "mint-dark": "#5CBFA9",
          "orange-dark": "#F59E8A",
        },
        surface: {
          light: "#FFFFFF",
          warm: "#FFF7E8",
          card: "rgba(255, 255, 255, 0.72)",
          "card-dark": "rgba(30, 30, 40, 0.72)",
        },
      },
      fontFamily: {
        sans: [
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 7s ease-in-out 1s infinite",
        "float-slow": "float 8s ease-in-out 2s infinite",
        "particle": "particle 20s linear infinite",
        "fade-in": "fadeIn 0.8s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "scale-in": "scaleIn 0.4s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        particle: {
          "0%": { transform: "translateY(0) scale(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(-100vh) scale(1)", opacity: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(79, 142, 247, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(79, 142, 247, 0.6)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
