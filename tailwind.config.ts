import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#070b14",
        panel: "#0d1422",
        panel2: "#111a2c",
        line: "#1c2740",
        muted: "#7d8aa5",
        text: "#d7deec",
        up: "#16c784",
        down: "#ea3943",
        warn: "#f5a524",
        ai: "#2dd4bf",
        accent: "#3b82f6",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
