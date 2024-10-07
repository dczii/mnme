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
        "light-gray": "#dadade",
        "dark-brown": "#442e26",
        "medium-brown": "#7e5233",
        "light-brown": "#b98753",
      },
      backgroundImage: {
        "gradient-company": "linear-gradient(135deg, #dadade, #b98753)",
        "gradient-title": "linear-gradient(90deg, #442e26, #b98753)",
      },
    },
  },
  plugins: [],
};
export default config;
