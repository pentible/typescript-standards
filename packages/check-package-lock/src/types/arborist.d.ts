import "@npmcli/arborist";

declare module "@npmcli/arborist" {
    interface Node {
        // TODO: investigate the Arborist types (& contribute changes)
        version: string;
        isWorkspace?: boolean;
        edgesOut?: Map<string, Edge>;
    }
}
