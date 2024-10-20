import { Console } from "node:console";
import { stderr, stdout } from "process";
// eslint-disable-next-line import/no-named-as-default
import Arborist from "@npmcli/arborist";

// TODO: remove
const console = new Console({
    groupIndentation: 4,
    stdout,
    stderr,
    inspectOptions: { depth: 10000 },
});

async function main() {
    const arborist = new Arborist({
        // path: "./packages/check-package-lock/examples/monorepo-packages-conflicting-deps",
        path: "./packages/check-package-lock/examples/typescript-app-template-expo-circular",
        // path: "./packages/check-package-lock/examples/a-misc-real-monorepo",
        // path: `${process.env.HOME}/pentible/typescript-app-template`,
        // path: `${process.env.HOME}/Projects/cavalier`,
    });

    // NOTE: we only care about what's in the package lock (not node_modules)
    // thus we load virtual
    const packageLock = await arborist.loadVirtual();
    const workspaces = [...packageLock.fsChildren.values()].filter(
        (n) => n.isWorkspace,
    );

    // NOTE: child packages of a workspace (packages within it's individual
    // node_modules), are considered to be conflicts (since npm would otherwise
    // be able to install them in the root node_modules)
    const conflicts = [
        ...workspaces
            .map((n) => [...n.children.values()])
            .flat()
            .values(),
    ];

    // collect conflict dependency paths
    const conflictDependencyPaths = conflicts.map((conflict) => ({
        conflict,
        paths: getDependencyPaths(conflict),
    }));

    // TODO: direct dependencies only
    for (const conflictDependencyPath of conflictDependencyPaths) {
        console.log(`! ${conflictDependencyPath.conflict.name}`);
        for (const path of conflictDependencyPath.paths) {
            console.log(`    - ${path.full.map((p) => p.name).join(" -> ")}`);
        }
    }
}

type Package = Arborist.Node | Arborist.Link;

interface Path {
    full: Package[];
}

function getDependencyPaths(pkg: Package): Path[] {
    let dependents = [...pkg.edgesIn.values()];
    // NOTE: if one of the dependents is already a workspace, we won't explore
    // up the other paths (we already found the most direct connection).
    if (dependents.some((d) => d.from?.isWorkspace)) {
        dependents = dependents.filter((d) => d.from?.isWorkspace);
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
                return [{ full: [dependent.from, pkg] }];
            }

            return getDependencyPaths(dependent.from).map((path) => ({
                full: [...path.full, pkg],
            }));
        })
        .flat();
}

void main();
