import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#0c0c0e",
          50: "#16161a",
          100: "#1c1c21",
          200: "#26262d",
          300: "#33333c",
        },
        gold: {
          DEFAULT: "#c8a24a",
          light: "#e6c878",
          dark: "#9a7a2e",
          50: "#f6edd6",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        gold: "0 10px 40px -12px rgba(200, 162, 74, 0.35)",
        soft: "0 20px 60px -20px rgba(0, 0, 0, 0.7)",
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #e6c878 0%, #c8a24a 45%, #9a7a2e 100%)",
        "gold-radial":
          "radial-gradient(circle at 30% 20%, rgba(200,162,74,0.16), transparent 55%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        shimmer: "shimmer 6s linear infinite",
        "fade-up": "fade-up 0.7s ease-out both",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
