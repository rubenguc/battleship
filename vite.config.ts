/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

export default defineConfig({
  server: {
    port: 8000,
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      include: ["src/**/*.{ts,tsx}"], // Solo incluye archivos dentro de src
      exclude: [
        "src/i18n",
        "**/*.test.tsx",
        "**/*.test.ts",
        "**/index.ts",
        "src/interfaces.ts",
        "src/main.tsx",
        "src/routes.tsx",
        "src/vite-env.d.ts",
      ],
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 80,
        lines: 90,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
