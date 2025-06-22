import esbuild from "esbuild";

// TODO: move this somewhere common
// SEE: https://github.com/evanw/esbuild/issues/946#issuecomment-814703190
const cjsCompatibilityBanner = `import { createRequire as topLevelCreateRequire } from 'module';import { fileURLToPath as topLevelFileURLToPath } from 'url';import { dirname as topLevelDirname, join as topLevelJoin } from 'path';const __bundleRequire = topLevelCreateRequire(import.meta.url);const __bundleFilename = topLevelFileURLToPath(import.meta.url);const __bundleDirname = topLevelDirname(__bundleFilename);const __bundleJoin = topLevelJoin;globalThis.require = __bundleRequire;globalThis.__filename = __bundleFilename;globalThis.__dirname = __bundleDirname;globalThis.join = __bundleJoin;`;

/** @satisfies {import("esbuild").BuildOptions} */
const options = {
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node20",
    minify: true,
    banner: { js: cjsCompatibilityBanner },
    outfile: "./dist/main.js",
    entryPoints: ["src/main.ts"],
};

if (process.argv.includes("--watch")) {
    const context = await esbuild.context(options);
    await context.watch();
} else {
    await esbuild.build(options);
}
