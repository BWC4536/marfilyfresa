import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mf: {
          primary: "#FADADD",     // Soft Pink
          secondary: "#E6E6FA",   // Lilac
          accent: "#E0FFFF",      // Soft Cyan
          background: "#FFFFF0",  // Ivory / Off-white
          charcoal: "#333333",    // Deep Charcoal
        }
      },
      fontFamily: {
        sans: ['var(--font-lato)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      }
    },
  },
  plugins: [],
};

export default config;