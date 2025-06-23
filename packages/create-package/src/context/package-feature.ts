export const PackageFeature = {
    Esbuild: "esbuild",
    React: "react",
    ChakraUi: "chakra-ui",
} as const;

export type PackageFeature =
    (typeof PackageFeature)[keyof typeof PackageFeature];
