import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: false,
  dts: true,
  clean: true,
  outDir: "dist",
  target: "node18",
  format: "esm",
  banner: {
    js: "#!/usr/bin/env node",
  },
});
