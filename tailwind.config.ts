import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        orbital: {
          dark: "#030712",
          deep: "#02040a",
          navy: "#0a1128",
          blue: "#0066cc",
          cyan: "#38bdf8",
          glow: "#60a5fa",
          card: "rgba(10, 17, 40, 0.45)",
          border: "rgba(255, 255, 255, 0.12)",
        }
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        widestx2: '0.25em',
        widestx3: '0.35em',
      }
    },
  },
  plugins: [],
};
export default config;
