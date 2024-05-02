import { Console } from "console";
import { stderr, stdout } from "process";
import type { Edge, Link, Node } from "@npmcli/arborist";
import Arborist from "@npmcli/arborist";
// eslint-disable-next-line import/no-named-as-default
import Arborist from "@npmcli/arborist";
import { CheckError } from "~/checks";
import { Err, Ok } from "~/result";
import { onlyUnique } from "~/utils";

type Package = ReturnType<typeof mapPackageEntry>;

function mapPackageEntry(pkg: Node) {
    const isSubNodeModule = /node_modules\/.*\/node_modules\//u.test(
        pkg.location,
    );

    return {
        raw: pkg,
        // TODO: fix type, this appears to actually be a map
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        edgesOut: pkg.edgesOut as unknown as Map<string, Edge> | undefined,
        version: pkg.package.version,
        name: pkg.name,
        path: pkg.location,
        isConflict: pkg.location.includes("/node_modules/") && !isSubNodeModule,
        isTopLevel:
            pkg.location.startsWith("node_modules/") && !isSubNodeModule,
        // isWorkspace: pkg.isWorkspace ?? false,
        workspacePath: pkg.location.replace(
            new RegExp(`/node_modules/${pkg.name}$`, "u"),
            "",
        ),
    };
}

type Path = Node[];
function getDependencyPaths(
    packages: Package[],
    current: Node,
    limit = 10,
): Path[] {
    // once we get to a package without a parent (either a workspace, or the root package), we've discovered the whole dep path
    // TODO: limit is to prevent issues with circular dependencies... (is there a better way, also this is still a bit f'd...)
    if (current.parent === null || limit <= 0) {
        return [];
    }

    // find all packages which depend on the current package
    const dependents = Array.from(current.edgesIn, (e) => e.from);

    return (
        dependents
            // recurse up all dependents
            .map((pkg) => [
                pkg,
                ...getDependencyPaths(packages, pkg, limit - 1).flat(),
            ])
            // we only want to show paths that end at a workspace/root package...
            .filter((path) => path[path.length - 1]?.parent === null)
    );
}

class Unreachable extends Error {
    override name = "Unreachable" as const;
}

function getDirectDependencyOfPath(path: Path) {
    // last non-workspace part should be the direct dependency that is causing the conflict
    const nonWorkspacePath = path.filter((p) => p.parent === null);
    const directDependency = nonWorkspacePath[nonWorkspacePath.length - 1];
    if (!directDependency) {
        throw new Unreachable(
            "dependency paths will always at least contain the conflict itself",
        );
    }

    return directDependency;
}

class ConflictingDependenciesCheckError extends CheckError {
    override name = "ConflictingDependenciesCheckError" as const;

    constructor(readonly conflicts: { conflict: Package; parent: Node }[]) {
        const description = conflicts
            .map((p) => {
                // TODO: was using p.workspacePath...
                // TODO: should simply be workspace location (need to include that reasonably here)

                return `- ${p.conflict.raw.name} (${p.conflict.raw.package.version ?? ""}) in ${p.parent.location}`;
            })
            .join("\n");
        super("conflicting package versions detected", description);
    }
}

interface UnknownDescription {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __type: string;
    // NOTE: we return this as a comma separated string to keep the output shorter (in terms of lines when formatted)
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __keys?: string;
    [key: string]:
        | string[]
        | UnknownDescription
        | UnknownDescription[]
        | string
        | undefined;
}

/**
 * selectively, and recursively return mapped object
 */
function mapRecurse(
    current: unknown,
    keepFields: string[] = [],
    depth = 0,
): UnknownDescription {
    if (depth > 20) {
        // NOTE: to handle circular deps...
        // TODO: probs should keep track of seen objects instead? and check that way?
        return { __type: "unknown", error: "reached max depth bb..." };
    }

    if (
        current != null &&
        typeof current === "object" &&
        "entries" in current &&
        typeof current.entries === "function"
    ) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const currentObjectEntries: unknown = [...current.entries()];
            if (Array.isArray(currentObjectEntries)) {
                return mapRecurse(
                    Object.fromEntries(currentObjectEntries),
                    keepFields,
                    depth + 1,
                );
            }
        } catch (e) {
            // ignore any errors because we're just trying our best to identify Map like objects
        }
    }

    const result: UnknownDescription = {
        __type: current?.constructor.name ?? "unknown",
    };

    // TODO: would be cool to have keepFields support type/path filters so we can say to keep a field of a specific class only, or keep some nested structure only

    // NOTE: we keep this off the result when empty to keep the output cleaner
    const keys =
        current != null
            ? // NOTE: we exclude keep fields & objects since they'll be in the output already
              Object.keys(current).filter(
                  (k) =>
                      !keepFields.includes(k) && typeof current[k] !== "object",
              )
            : [];
    if (keys.length > 0) {
        result.__keys = keys.join(",");
    }

    for (const key of Object.getOwnPropertyNames(current)) {
        // @ts-expect-error because yo
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const value = current[key];
        if (Array.isArray(value) || value instanceof Set) {
            result[key] = Array.from(value, (v) =>
                mapRecurse(v, keepFields, depth + 1),
            );
        } else if (typeof value === "object" && value != null) {
            result[key] = mapRecurse(value, keepFields, depth + 1);
        }

        // TODO: atm this will override objects, wouldn't we prefer keeping the Description & the value...? (maybe...)
        if (keepFields.includes(key)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            result[key] = value;
        }
    }

    return result;
}

export async function checkDependenciesConflict() {
    const console = new Console({
        groupIndentation: 4,
        stdout,
        stderr,
        inspectOptions: { depth: 4, maxArrayLength: 10000 },
    });

    // NOTE: loads package-lock.json from cwd
    const arborist = new Arborist();
    const packageLock = await arborist.loadVirtual();
    // console.log(99, packageLock.children);
    // console.log(99, JSON.stringify(mapRecurse(packageLock, ["name", "path"])));

    // TODO: rename and move
    const getEm = (pkg: Link | Node): Package[] => {
        const arbPkg = pkg.isLink ? pkg.target : pkg;
        if (arbPkg.children.size === 0) {
            return [mapPackageEntry(arbPkg)];
        }

        return [
            mapPackageEntry(arbPkg),
            ...Array.from(arbPkg.children, ([_, p]) => getEm(p)).flat(),
        ];
    };

    // map packages
    const packages = Array.from(packageLock.fsChildren, (p) => getEm(p)).flat();

    // find conflicts
    const conflicts = packages.filter((p) => p.isConflict);
    // console.log(
    //     272,
    //     JSON.stringify(conflicts.map((v) => mapRecurse(v, ["name", "path"]))),
    // );

    // TODO: might need to filter conflictDependencyPaths something like:
    // - if there's a direct dep that's a conflict, include
    // - if a package isn't a direct dep, and it had a direct dep that's a conflict in it's ancestry of deps, don't include
    // - else, include

    // collect conflict dependency paths
    const conflictDependencyPaths = conflicts.map((conflict) => ({
        conflict,
        // TODO: include top level package
        // TODO: use top level package's edgesIn to show where this top level dep comes from
        // topLevelPackage: packages.find(
        //     (p) => p.isTopLevel && p.name === conflict.name,
        // ),
        paths: getDependencyPaths(packages, conflict.raw).map((p) => [
            conflict.raw,
            ...p,
        ]),
    }));
    console.log(123, mapRecurse(conflictDependencyPaths, ["name"]));

    // TODO: the script no longer properly handles de-duping indirect conflicts with the direct dependency that causes them to conflict...

    // collect direct dependency conflicts
    const directDependencyConflicts = conflictDependencyPaths
        .flatMap(({ conflict, paths }) => {
            console.log(244, mapRecurse({ paths }, ["name"]));
            console.log(
                245,
                mapRecurse(
                    { paths: paths.flatMap(getDirectDependencyOfPath) },
                    ["name"],
                ),
            );

            return {
                conflict,
                // TODO: fix
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                parent: paths.flatMap(getDirectDependencyOfPath)[0]!,
            };
        })
        // TODO: why was I sorting?... consistency?
        .sort((a, b) => a.conflict.name.localeCompare(b.conflict.name));

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
