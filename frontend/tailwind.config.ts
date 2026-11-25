import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

/*
 * NephroSasa brand
 * Ink navy for hero bands and app chrome, clinical blue for actions,
 * cool slate neutrals. Teal, cyan, indigo and violet fold into the blue
 * family so every screen shares one palette.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#070D1A",
          2: "#0D1F45",
          3: "#13295A",
        },
        primary: {
          DEFAULT: "#3B82F6",
          dark: "#2563EB",
          light: "#60A5FA",
        },
        accent: {
          DEFAULT: "#0D1F45",
          dark: "#070D1A",
          light: "#60A5FA",
        },
        gray: colors.slate,
        teal: colors.blue,
        cyan: colors.sky,
        indigo: colors.blue,
        violet: colors.blue,
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["var(--font-display)", "var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "Menlo", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      keyframes: {
        rise: { from: { transform: "translateY(105%)" }, to: { transform: "none" } },
        fadeUp: { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: {
        rise: "rise .9s cubic-bezier(.2,.7,.1,1) both",
        "fade-up": "fadeUp .9s ease both",
      },
    },
  },
};

export default config;
