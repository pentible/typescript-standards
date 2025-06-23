export const PackageAccessLevel = {
    Private: "private",
    Restricted: "restricted",
    Public: "public",
} as const;

export type PackageAccessLevel =
    (typeof PackageAccessLevel)[keyof typeof PackageAccessLevel];
