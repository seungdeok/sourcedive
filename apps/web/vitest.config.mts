import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    exclude: ["./__test__/e2e/**", "node_modules"],
    environment: "jsdom",
  },
});
