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
          primary: "#76AFE5",
          secondary: "#BAF2BB",
          neutral: "#031a1d",
          "base-100": "#fcfcfc",
          info: "#ddedea",
          success: "#19cc55",
          warning: "#fcf4dd",
          error: "#FF5C82",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
export default config;
