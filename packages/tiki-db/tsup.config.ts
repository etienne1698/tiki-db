import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/reactive/vue/vue.ts",
    "src/reactive/react/react.ts",
    "src/storage/idb/idb_storage.ts",
    "src/storage/in_memory/in_memory_storage.ts",
  ],
  clean: true,
  format: ["cjs", "esm"],
  dts: true,
});
