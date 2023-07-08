import fs from "fs/promises";
import minimatch from "minimatch";
import { SemVer, parse, satisfies } from "semver";
import { z } from "zod";
import { CheckError } from "~/checks";
import { Err, Ok } from "~/result";
import { onlyUnique, isNonNullable } from "~/utils";

type SchemaPackage = z.infer<typeof packageLockSchema>["packages"][number];
type Package = ReturnType<typeof mapPackageEntry>;

function mapPackageEntry(
    path: string,
    pkg: SchemaPackage,
    workspacePaths: string[],
) {
    const isSubNodeModule = /node_modules\/.*\/node_modules\//u.test(path);
    const name = path.replace(/.*\/node_modules\//u, "");
    return {
        ...pkg,
        version: pkg.version ?? new SemVer("0.0.0"),
        name,
        path,
        isConflict: path.includes("/node_modules/") && !isSubNodeModule,
        isTopLevel: path.startsWith("node_modules/") && !isSubNodeModule,
        isWorkspace: workspacePaths.some((w) => minimatch(path, w)),
        workspacePath: path.replace(
            new RegExp(`/node_modules/${name}$`, "u"),
            "",
        ),
    };
}

function packageDependsOnVersion(pkg: Package, dependency: Package) {
    return (
        pkg.dependencies?.[dependency.name] ??
        pkg.peerDependencies?.[dependency.name] ??
        pkg.devDependencies?.[dependency.name]
    );
}

function getDependents(packages: Package[], current: Package) {
    // find top level instance of this package
    const topLevelPackage = packages.find(
        (p) => p.isTopLevel && p.name === current.name,
    );

    return (
        packages
            // find general dependents on this package (ignoring version)
            .map((pkg) => {
                const dependentVersion = packageDependsOnVersion(pkg, current);
                if (!dependentVersion) {
                    return undefined;
                }

                return {
                    pkg,
                    dependentVersion,
                };
            })
            .filter(isNonNullable)
            // find dependents within the same workspace (or in the root node_modules)
            .filter(
                ({ pkg }) =>
                    pkg.isTopLevel ||
                    pkg.path.startsWith(current.workspacePath),
            )
            // satisfied by the current version
            .filter(({ dependentVersion }) =>
                satisfies(current.version, dependentVersion),
            )
            // doesn't satisfy the top level version of this package
            .filter(
                ({ dependentVersion }) =>
                    !topLevelPackage ||
                    !satisfies(topLevelPackage.version, dependentVersion),
            )
            // just the package
            .map(({ pkg }) => pkg)
    );
}

type Path = Package[];
function getDependencyPaths(packages: Package[], current: Package): Path[] {
    // once we get to a workspace package, we've discovered the whole dep path
    if (current.isWorkspace) {
        return [];
    }

    // find all packages which depend on the current package
    const dependents = getDependents(packages, current);

    return (
        dependents
            // recurse up all dependents
            .map((pkg) => [pkg, ...getDependencyPaths(packages, pkg).flat()])
            // we only want to show paths that end at a workspace...
            .filter((path) => path[path.length - 1]?.isWorkspace)
    );
}

class Unreachable extends Error {
    override name = "Unreachable" as const;
}

function getDirectDependencyOfPath(path: Path) {
    // last non-workspace part should be the direct dependency that is causing the conflict
    const nonWorkspacePath = path.filter((p) => !p.isWorkspace);
    const directDependency = nonWorkspacePath[nonWorkspacePath.length - 1];
    if (!directDependency) {
        throw new Unreachable(
            "dependency paths will always at least contain the conflict itself",
        );
    }

    return directDependency;
}

// package lock schema
const packageLockSchema = z.object({
    name: z.string(),
    packages: z.record(
        z.string(),
        z.object({
            version: z
                .string()
                .transform((version) => parse(version) ?? undefined)
                .optional(),
            workspaces: z.array(z.string()).optional(),
            dependencies: z.record(z.string(), z.string()).optional(),
            devDependencies: z.record(z.string(), z.string()).optional(),
            peerDependencies: z.record(z.string(), z.string()).optional(),
        }),
    ),
});

class ConflictingDependenciesCheckError extends CheckError {
    override name = "ConflictingDependenciesCheckError" as const;

    constructor(readonly conflicts: Package[]) {
        const description = conflicts
            .map(
                (p) =>
                    `- ${p.name} (${p.version.format()}) in ${p.workspacePath}`,
            )
            .join("\n");
        super("conflicting package versions detected", description);
    }
}

export async function checkDependenciesConflict() {
    // load package lock
    const packageLockContents = (
        await fs.readFile("package-lock.json")
    ).toString();
    const packageLockJson: unknown = JSON.parse(packageLockContents);
    const packageLock = packageLockSchema.parse(packageLockJson);

    // workspace paths (with leading ./ trimmed)
    const monorepoRootPackage = packageLock.packages[""];
    const workspacePaths = (monorepoRootPackage?.workspaces ?? []).map((s) =>
        s.replace(/^.\//u, ""),
    );

    // map packages
    const packages = Object.entries(packageLock.packages).map(([path, pkg]) =>
        mapPackageEntry(path, pkg, workspacePaths),
    );

    // find conflicts
    const conflicts = packages.filter((p) => p.isConflict);

    // collect conflict dependency paths
    const conflictDependencyPaths = conflicts.map((conflict) => ({
        conflict,
        paths: getDependencyPaths(packages, conflict).map((p) => [
            conflict,
            ...p,
        ]),
    }));

    // collect direct dependency conflicts
    const directDependencyConflicts = conflictDependencyPaths
        .flatMap(({ paths }) => paths.flatMap(getDirectDependencyOfPath))
        .filter(onlyUnique) // often multiple conflicts will be caused by a single dependency...
        .sort((a, b) => a.name.localeCompare(b.name));

    // TODO: consider an option to show the full paths...
    // // show dep paths
    // for (const { conflict, paths } of conflictDependencyPaths) {
    //     console.log(
    //         `% conflict ${
    //             conflict.path
    //         } (${conflict.version.format()}) due to:`,
    //     );
    //     for (const path of paths) {
    //         console.log(
    //             `    - ${path
    //                 .map((p) => `${p.name} (${p.version.format()})`)
    //                 .join(" -> ")}`,
    //         );
    //     }
    // }

    if (directDependencyConflicts.length > 0) {
        return Err(
            new ConflictingDependenciesCheckError(directDependencyConflicts),
        );
    }

    return Ok(true);
}
