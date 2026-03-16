import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "index.html"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          brand: {
            primary: { value: "#6d28d9" },
            secondary: { value: "#7c3aed" },
            light: { value: "#ede9fe" },
          }
        }
      }
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
