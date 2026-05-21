import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        paper: "#FFFFFF",
        mist: "#F5F5F5",
        line: "#EAEAEA",
        apex: "#00029C"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Helvetica Neue", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 24px 80px rgba(17, 17, 17, 0.08)",
        glass: "0 18px 45px rgba(17, 17, 17, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
