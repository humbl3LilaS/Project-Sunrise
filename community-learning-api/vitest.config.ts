import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@db": path.resolve(__dirname, "./src/db"),
      "@middlewares": path.resolve(__dirname, "./src/middlewares"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@doc": path.resolve(__dirname, "./src/doc"),
      "@actions": path.resolve(__dirname, "./src/actions"),
      "@valid": path.resolve(__dirname, "./src/validators"),
      "@const": path.resolve(__dirname, "./src/constants"),
    },
  },
});
