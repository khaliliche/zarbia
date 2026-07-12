import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["'Work Sans'", "sans-serif"],
        mono2: ["'IBM Plex Mono'", "monospace"],
        arabic: ["Cairo", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
