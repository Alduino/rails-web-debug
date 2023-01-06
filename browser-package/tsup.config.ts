import {defineConfig} from "tsup";

export default defineConfig({
    format: ["iife"],
    clean: true,
    entry: ["./src/index.ts"],
    minify: true
});
