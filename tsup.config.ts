import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli.ts"],
  format: ["cjs"],
  target: "node18",
  clean: true,
  minify: false,
  sourcemap: false,
  banner: {
    js: "#!/usr/bin/env node\n"
  }
});
