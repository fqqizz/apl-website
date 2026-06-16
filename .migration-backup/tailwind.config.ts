import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        apl: {
          white: "var(--apl-white)",
          "off-white": "var(--apl-off-white)",
          navy: "var(--apl-navy)",
          "navy-mid": "var(--apl-navy-mid)",
          "navy-light": "var(--apl-navy-light)",
          blue: "var(--apl-blue)",
          "blue-bright": "var(--apl-blue-bright)",
          "blue-dim": "var(--apl-blue-dim)",
          gold: "var(--apl-gold)",
          "gold-dim": "var(--apl-gold-dim)",
          "text-primary": "var(--apl-text-primary)",
          "text-secondary": "var(--apl-text-secondary)",
          "text-muted": "var(--apl-text-muted)"
        }
      },
      borderColor: {
        apl: "var(--apl-border)",
        "apl-accent": "var(--apl-border-accent)"
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
