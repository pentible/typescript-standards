// TODO: remove once next eslint plugin gets types
declare module "@next/eslint-plugin-next" {
    export const flatConfig: {
        coreWebVitals: import("eslint").Linter.Config;
    };
}
