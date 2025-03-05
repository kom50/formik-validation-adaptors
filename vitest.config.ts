import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "istanbul", // or 'v8'
      reporter: ["text"], // Generates coverage report in terminal and as an HTML file
      all: true,
      exclude: [
        "node_modules",
        "dist",
        "coverage",
        ".github",
        "examples",
        "vitest.config.ts",
      ],
    },
    reporters: ["default", "verbose"], // Show detailed test cases
  },
});
