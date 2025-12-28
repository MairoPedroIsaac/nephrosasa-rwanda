// tailwind.config.ts
// This file tells Tailwind CSS which files to scan for class names
// and defines custom colors for HealthVault Rwanda

import type { Config } from "tailwindcss";

const config: Config = {
  // Tell Tailwind to scan all TypeScript/JavaScript files in these directories
  // for class names like "bg-blue-500" or "text-white"
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",     // Pages directory (if used)
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // All component files
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",       // App Router pages
  ],
  
  theme: {
    extend: {
      // Custom colors for HealthVault Rwanda brand
      colors: {
        primary: {
          // Different shades of our main blue color
          DEFAULT: "#2563EB", // Main blue (use as "bg-primary")
          dark: "#1E40AF",    // Darker blue for hover states
          light: "#3B82F6",   // Lighter blue for backgrounds
        },
        accent: {
          // Teal accent color
          DEFAULT: "#06B6D4",
          dark: "#0891B2",
          light: "#22D3EE",
        },
        success: "#10B981",  // Green for success messages
        warning: "#F59E0B",  // Orange for warnings
        danger: "#EF4444",   // Red for errors
      },
    },
  },
  
  //plugins: [], // We can add Tailwind plugins here later if needed
};

export default config;