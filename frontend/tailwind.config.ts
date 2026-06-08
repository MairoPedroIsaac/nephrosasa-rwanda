import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3B82F6", 
          dark: "#2563EB",    
          light: "#60A5FA",   
        },
        accent: {
          DEFAULT: "#34D399",
          dark: "#10B981",
          light: "#6EE7B7",
        },
        success: "#10B981",  
        warning: "#F59E0B",  
        danger: "#EF4444",   
      },
    },
  },
};

export default config;
