// NOTE: this isn't actually exported named, I believe it's confused due to
// export being a class and a namespace
// eslint-disable-next-line import-x/no-named-as-default
import Arborist from "@npmcli/arborist";
import { CheckError } from "#src/checks";
import { Err, Ok } from "#src/result";
import { onlyUnique } from "#src/utils";

export async function checkDependenciesConflict() {
    const arborist = new Arborist();

    // NOTE: we only care about what's in the package lock (not node_modules)
    // thus we load virtual
    const packageLock = await arborist.loadVirtual();
    const workspaces = [...packageLock.fsChildren.values()].filter(
        (n) => n.isWorkspace,
    );

    // NOTE: child packages of a workspace (packages within it's individual
    // node_modules), are considered to be conflicts (since npm would otherwise
    // be able to install them in the root node_modules)
    const conflicts = workspaces.flatMap((n) => [...n.children.values()]);

    // collect conflict dependency paths
    const conflictDependencyPaths = conflicts.map((conflict) => ({
        conflict,
        paths: getDependencyPaths(conflict),
    }));

    // TODO: consider option to show the full paths
    // for (const conflictDependencyPath of conflictDependencyPaths) {
    //     console.log(`! ${conflictDependencyPath.conflict.name}`);
    //     for (const path of conflictDependencyPath.paths) {
    //         console.log(`    - ${path.full.map((p) => p.name).join(" -> ")}`);
    //     }
    // }
    // // OR as
    // // show dep paths
    // for (const { conflict, paths } of conflictDependencyPaths) {
    //     console.log(
    //         `% conflict ${conflict.path} (${conflict.version}) due to:`,
    //     );
    //     for (const path of paths) {
    //         console.log(
    //             `    - ${path.full
    //                 .map((p) => `${p.name} (${p.version})`)
    //                 .join(" -> ")}`,
    //         );
    //     }
    // }

    // TODO: improve this
    // - pick the shortest path
    // - restructure uniqueness checks to allow forwarding through additional info to the error

    // collect direct dependency conflicts
    const directDependencyConflicts = conflictDependencyPaths
        .flatMap(({ paths }) => paths.map((p) => p.directConflict))
        .filter(onlyUnique) // often multiple conflicts will be caused by a single dependency...
        .sort((a, b) => a.name.localeCompare(b.name));

    if (directDependencyConflicts.length > 0) {
        return Err(
            new ConflictingDependenciesCheckError(directDependencyConflicts),
        );
    }

    return Ok(true);
}

class ConflictingDependenciesCheckError extends CheckError {
    override name = "ConflictingDependenciesCheckError" as const;

    constructor(readonly conflicts: Package[]) {
        const description = conflicts
            .map((p) => {
                // TODO: decide between showing the spec & the resolved version...
                // TODO: if we want to keep resolved version, figure out how to fetch properly
                return `- ${p.name} (${p.version}) in ${p.parent?.location}`;
            })
            .join("\n");
        super("conflicting package versions detected", description);
    }
}

type Package = Arborist.Node | Arborist.Link;

interface Path {
    workspace: Package;
    directConflict: Package;
    full: Package[];
}

function getDependencyPaths(
    pkg: Package,
    visited = new Set<Package>(),
): Path[] {
    if (visited.has(pkg)) {
        // NOTE: if we have a cycle, we don't care about the path. Empty path is
        // fine here since another branch should have a result, and this one
        // will be flattened
        return [];
    }
    visited.add(pkg);

    let dependents = [...pkg.edgesIn.values()];
    // NOTE: if one of the dependents is already a workspace, we won't explore
    // up the other paths (we already found the most direct connection).
    const workspaceDependents = dependents.filter(
        (d) => d.from?.isWorkspace ?? false,
    );
    if (workspaceDependents.length > 0) {
        dependents = workspaceDependents;
    }

    return dependents
        .map((dependent) => {
            // TODO: figure out under what circumstances this is even possible
            if (!dependent.to || !dependent.from) {
                throw new Error(
                    `dependent edge without to/from values, package: ${pkg.name} edge: ${JSON.stringify(dependent)}`,
                );
            }

            if (dependent.from.isWorkspace) {
                return [
                    {
                        workspace: dependent.from,
                        directConflict: pkg,
                        full: [dependent.from, pkg],
                    },
                ];
            }

            return getDependencyPaths(dependent.from, new Set(visited)).map(
                (path) => ({
                    workspace: path.workspace,
                    directConflict: path.directConflict,
                    full: [...path.full, pkg],
                }),
            );
        })
        .flat();
}
