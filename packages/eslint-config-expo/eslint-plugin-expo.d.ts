// TODO: remove once next eslint plugin gets types
declare module "eslint-plugin-expo" {
    export declare const plugin: {
        meta: { name: string; version: string };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rules: Record<string, any>;
    };
    export default plugin;
}
