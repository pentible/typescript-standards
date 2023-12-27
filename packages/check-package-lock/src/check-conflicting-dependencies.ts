import { Console } from "console";
import { stderr, stdout } from "process";
import type { Node, Edge } from "@npmcli/arborist";
// eslint-disable-next-line import/no-named-as-default
import Arborist from "@npmcli/arborist";
import { CheckError } from "~/checks";
import { Err, Ok } from "~/result";

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
        version: pkg.version,
        name: pkg.name,
        path: pkg.location,
        isConflict: pkg.location.includes("/node_modules/") && !isSubNodeModule,
        isTopLevel:
            pkg.location.startsWith("node_modules/") && !isSubNodeModule,
        isWorkspace: pkg.isWorkspace ?? false,
        workspacePath: pkg.location.replace(
            new RegExp(`/node_modules/${pkg.name}$`, "u"),
            "",
        ),
    };
}

type Path = Node[];
function getDependencyPaths(packages: Package[], current: Node): Path[] {
    // TODO: decide what makes the most sense: current.raw.parent === null ?
    // once we get to a workspace package, we've discovered the whole dep path
    if (current.isWorkspace === true) {
        return [];
    }

    // find all packages which depend on the current package
    const dependents = Array.from(current.edgesIn, (e) => e.from);

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
    const nonWorkspacePath = path.filter((p) => p.isWorkspace !== true);
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

    constructor(readonly conflicts: Path) {
        const description = conflicts
            .map(
                (p) =>
                    // TODO: was using p.workspacePath...
                    // TODO: should simply be workspace location (need to include that reasonably here)
                    `- ${p.name} (${p.version}) in ${p.parent?.location ?? ""}`,
            )
            .join("\n");
        super("conflicting package versions detected", description);
    }
}

export async function checkDependenciesConflict() {
    const console = new Console({
        groupIndentation: 4,
        stdout,
        stderr,
        inspectOptions: { depth: 10000 },
    });

    // NOTE: loads package-lock.json from cwd
    const arborist = new Arborist();
    const packageLock = await arborist.loadVirtual();

    // map packages
    // TODO: cleanup
    const packages = Array.from(packageLock.children, ([_, pkg]) => {
        const arbPkg = pkg.isLink ? pkg.target : pkg;

        // TODO: recurse proper
        // TODO: make sure we only include unique packages (probably implicitly handled? but want to make sure)
        return [
            mapPackageEntry(arbPkg),
            ...Array.from(arbPkg.children, ([_, p]) => mapPackageEntry(p)),
        ];
    }).flat();

    // find conflicts
    const conflicts = packages.filter((p) => p.isConflict);
    // console.log(108, conflicts.length);

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
    // console.log(123, conflictDependencyPaths);

    // console.log(172, conflictDependencyPaths);

    // collect direct dependency conflicts
    const directDependencyConflicts = conflictDependencyPaths
        .flatMap(({ paths }) => paths.flatMap(getDirectDependencyOfPath))
        // .filter(onlyUnique) // often multiple conflicts will be caused by a single dependency...
        .sort((a, b) => a.name.localeCompare(b.name));
    // console.log(139, directDependencyConflicts.length);
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
