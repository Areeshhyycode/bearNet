import type { Config } from "tailwindcss";

/**
 * BearNet design system — tokens mirror DESIGN.md exactly.
 * Cozy baby-pink study sanctuary: warm cream surfaces, blush washes,
 * soft lavender whispers, espresso-brown ink.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-bright": "#fff8f7",
        "error-container": "#ffdad6",
        "surface-dim": "#f5d1d5",
        "on-secondary-container": "#74567e",
        "on-tertiary-fixed-variant": "#7f2448",
        secondary: "#71547c",
        "tertiary-fixed-dim": "#ffb1c6",
        surface: "#fff8f7",
        "on-surface-variant": "#514346",
        "inverse-primary": "#f8b4c7",
        "secondary-container": "#f5d0ff",
        "on-primary-fixed-variant": "#693748",
        "on-tertiary-container": "#812649",
        "tertiary-container": "#ff99b8",
        "on-background": "#2a1619",
        "surface-container-high": "#ffe1e4",
        error: "#ba1a1a",
        "on-secondary": "#ffffff",
        background: "#fff8f7",
        "on-primary-container": "#6b3949",
        primary: "#844e5f",
        "primary-fixed": "#ffd9e2",
        outline: "#837376",
        "inverse-on-surface": "#ffeced",
        "primary-fixed-dim": "#f8b4c7",
        "secondary-fixed-dim": "#dfbae9",
        "on-secondary-fixed-variant": "#583c63",
        "on-error": "#ffffff",
        tertiary: "#9d3c5f",
        "secondary-fixed": "#f8d8ff",
        "surface-container-highest": "#fedadd",
        "surface-container": "#ffe9ea",
        "surface-tint": "#844e5f",
        "primary-container": "#e8a5b8",
        "on-error-container": "#93000a",
        "on-primary-fixed": "#350d1c",
        "tertiary-fixed": "#ffd9e1",
        "on-secondary-fixed": "#2a1135",
        "surface-container-lowest": "#ffffff",
        "outline-variant": "#d5c2c5",
        "surface-variant": "#fedadd",
        "surface-container-low": "#fff0f1",
        "on-tertiary": "#ffffff",
        "on-surface": "#2a1619",
        "inverse-surface": "#412a2d",
        "on-primary": "#ffffff",
        "on-tertiary-fixed": "#3f001c",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
        card: "24px",
        panel: "28px",
      },
      spacing: {
        gutter: "1.25rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "gutter-mobile": "0.75rem",
        "space-lg": "1.5rem",
        "space-md": "1rem",
        margin: "2rem",
        "space-xl": "2.25rem",
        "margin-mobile": "1rem",
      },
      fontFamily: {
        "label-code": ["var(--font-mono)", "JetBrains Mono", "monospace"],
        "headline-md": ["var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
        "body-md": ["var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
        "headline-lg": ["var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
        "headline-xl-mobile": ["var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
        "headline-xl": ["var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
        "body-lg": ["var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
        "label-badge": ["var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
        "body-sm": ["var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
      },
      fontSize: {
        "label-code": ["13px", { lineHeight: "18px", fontWeight: "500" }],
        "headline-md": ["22px", { lineHeight: "28px", fontWeight: "600" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "headline-lg": [
          "28px",
          { lineHeight: "36px", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "headline-xl-mobile": [
          "30px",
          { lineHeight: "38px", letterSpacing: "-0.015em", fontWeight: "700" },
        ],
        "headline-xl": [
          "40px",
          { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-badge": [
          "11px",
          { lineHeight: "14px", letterSpacing: "0.04em", fontWeight: "600" },
        ],
        "body-sm": ["12px", { lineHeight: "18px", fontWeight: "400" }],
      },
      boxShadow: {
        // Level 1 — pastel study cards
        cozy: "0 2px 4px rgba(61,39,42,0.02), 0 10px 24px -4px rgba(232,165,184,0.22)",
        // Hero / panel ambient blush
        hero: "0 12px 36px -6px rgba(232,165,184,0.30)",
        // Level 2 — popovers, overlays
        float: "0 16px 36px -6px rgba(158,61,96,0.14)",
        soft: "0 4px 16px rgba(132,78,95,0.06)",
        faint: "0 1px 8px rgba(0,0,0,0.04)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "bear-bob": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.35", transform: "scale(0.85)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        "typing-dot": {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.45" },
          "30%": { transform: "translateY(-4px)", opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "bear-bob": "bear-bob 4s ease-in-out infinite",
        twinkle: "twinkle 2.6s ease-in-out infinite",
        "typing-dot": "typing-dot 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
