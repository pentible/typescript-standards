import type PackageContext from "~/src/context/PackageContext";
import type Component from "~/src/components/Component";
import PackageJsonComponent from "~/src/components/PackageJsonComponent";
import TypescriptComponent from "~/src/components/TypescriptComponent";
import EslintComponent from "~/src/components/EslintComponent";
import PrettierComponent from "~/src/components/PrettierComponent";
import LintStagedComponent from "~/src/components/LintStagedComponent";
import HuskyComponent from "~/src/components/HuskyComponent";
import EditorConfigComponent from "~/src/components/EditorConfigComponent";
import NpmrcComponent from "~/src/components/NpmrcComponent";
import IgnoreFileComponent from "~/src/components/IgnoreFileComponent";
import JestComponent from "~/src/components/JestComponent";
import MonorepoPackagesComponent from "~/src/components/MonorepoPackagesComponent";
import LintFixComponent from "~/src/components/LintFixComponent";

export default function findMatchingComponents(ctx: PackageContext) {
    const components: Component[] = [
        // base
        new PackageJsonComponent(),
        new TypescriptComponent(),
        new EslintComponent(),
        // TODO: readme.md, src

        // root packages (ie. stand alone or monorepo roots)
        new PrettierComponent(),
        new LintStagedComponent(),
        new HuskyComponent(),
        new EditorConfigComponent(),
        new NpmrcComponent(),
        new IgnoreFileComponent(),
        new JestComponent(),
        // TODO: gh actions

        // TODO: browserslist

        // package type
        new MonorepoPackagesComponent(),

        // features
        // TODO: Parcel

        // lint fix
        new LintFixComponent(),
    ];

    return components.filter((c) => c.matches(ctx));
}
