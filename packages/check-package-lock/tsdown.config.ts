import { defineConfig } from "tsdown";

const config = defineConfig({
    platform: "node",
    minify: true,
    shims: true,
    entry: "src/main.ts",

    // force bundling dynamic imports (ie. p-map)
    outputOptions: { codeSplitting: false },
    // ignore hint about bundling deps
    deps: { onlyBundle: false },
});

export default config;
