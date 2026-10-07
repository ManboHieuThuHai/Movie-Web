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
        background: "#0f0f0f",
        primary: "#e50914",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)"],
        heading: ["var(--font-bebas-neue)"],
      },
      boxShadow: {
        glow: "0 0 24px rgb(229 9 20 / 0.45)",
        "glow-strong": "0 0 36px rgb(229 9 20 / 0.7)",
      },
    },
  },
  plugins: [],
};

export default config;
