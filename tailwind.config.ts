import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      transitionTimingFunction: {
        "out-back": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#182B3B",
          "primary-content": "#FBE9DA",
          secondary: "#F2BCBB",
          "secondary-content": "#0d0a08",
          accent: "#fd9541",
          neutral: "#FBE9DA",
          "base-100": "#FBE9DA",
          "base-content": "#0d0a08",
          info: "#2E6F9E",
          success: "#0FA3B1",
          warning: "#FF9233",
          error: "#E84855",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
export default config;
