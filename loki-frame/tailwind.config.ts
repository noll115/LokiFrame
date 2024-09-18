import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

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
          primary: "#BAD7f2",
          secondary: "#BAF2BB",
          neutral: "#031a1d",
          "base-100": "#fcfcfc",
          info: "#0081e3",
          success: "#19cc55",
          warning: "#ff8a00",
          error: "#FFC1CF",
        },
      },
      "pastel",
    ],
  },
  plugins: [require("daisyui")],
};
export default config;
