import BrowserslistComponent from "~/src/components/BrowserslistComponent";
import CheckPackageLockComponent from "~/src/components/CheckPackageLockComponent";
import type Component from "~/src/components/Component";
import EditorConfigComponent from "~/src/components/EditorConfigComponent";
import EslintComponent from "~/src/components/EslintComponent";
import HuskyComponent from "~/src/components/HuskyComponent";
import IgnoreFileComponent from "~/src/components/IgnoreFileComponent";
import JestComponent from "~/src/components/JestComponent";
import LintFixComponent from "~/src/components/LintFixComponent";
import LintStagedComponent from "~/src/components/LintStagedComponent";
import MonorepoPackagesComponent from "~/src/components/MonorepoPackagesComponent";
import NpmrcComponent from "~/src/components/NpmrcComponent";
import PackageJsonComponent from "~/src/components/PackageJsonComponent";
import PrettierComponent from "~/src/components/PrettierComponent";
import ShellcheckAllComponent from "~/src/components/ShellcheckAllComponent";
import TypescriptComponent from "~/src/components/TypescriptComponent";
import type PackageContext from "~/src/context/PackageContext";

export default function findMatchingComponents(ctx: PackageContext) {
    const components: Component[] = [
        // base
        new PackageJsonComponent(),
        new TypescriptComponent(),
        new EslintComponent(),
        new JestComponent(),
        new BrowserslistComponent(),
        // TODO: readme.md, src

        // root packages (ie. stand alone or monorepo roots)
        new CheckPackageLockComponent(),
        new ShellcheckAllComponent(),
        new PrettierComponent(),
        new LintStagedComponent(),
        new HuskyComponent(),
        new EditorConfigComponent(),
        new NpmrcComponent(),
        new IgnoreFileComponent(),
        // TODO: gh actions

        // package type
        new MonorepoPackagesComponent(),

        // features
        // TODO: Parcel

        // lint fix
        new LintFixComponent(),
    ];

    return components.filter((c) => c.matches(ctx));
}
