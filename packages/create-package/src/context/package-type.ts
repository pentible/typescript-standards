export const PackageType = {
    Web: "web",
    Node: "node",
    Library: "library",
    Monorepo: "monorepo",
    WebExtension: "web-extension",
    Electron: "electron",
    Config: "config", // TODO: maybe rename something like Plain/Basic/Base idk. or include a description
} as const;

export type PackageType = (typeof PackageType)[keyof typeof PackageType];
