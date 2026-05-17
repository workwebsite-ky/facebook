/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx,html}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Notion / Linear inspired neutral palette
        bg: {
          DEFAULT: "rgb(var(--bg) / <alpha-value>)",
          subtle: "rgb(var(--bg-subtle) / <alpha-value>)",
          muted: "rgb(var(--bg-muted) / <alpha-value>)",
          hover: "rgb(var(--bg-hover) / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(var(--border) / <alpha-value>)",
          strong: "rgb(var(--border-strong) / <alpha-value>)",
        },
        text: {
          DEFAULT: "rgb(var(--text) / <alpha-value>)",
          muted: "rgb(var(--text-muted) / <alpha-value>)",
          faint: "rgb(var(--text-faint) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          hover: "rgb(var(--accent-hover) / <alpha-value>)",
          subtle: "rgb(var(--accent-subtle) / <alpha-value>)",
        },
        hot: "rgb(239 68 68 / <alpha-value>)",
        warm: "rgb(245 158 11 / <alpha-value>)",
        cold: "rgb(59 130 246 / <alpha-value>)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)",
        drawer: "-8px 0 24px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
