import { BrowserslistComponent } from "~/components/browserslist-component";
import { ChakraUiComponent } from "~/components/chakra-ui-component";
import { CheckPackageLockComponent } from "~/components/check-package-lock-component";
import type { Component } from "~/components/component";
import { EditorConfigComponent } from "~/components/editor-config-component";
import { EsbuildComponent } from "~/components/esbuild-component";
import { EslintComponent } from "~/components/eslint-component";
import { HuskyComponent } from "~/components/husky-component";
import { IgnoreFileComponent } from "~/components/ignore-file-component";
import { LintFixComponent } from "~/components/lint-fix-component";
import { LintStagedComponent } from "~/components/lint-staged-component";
import { MonorepoPackagesComponent } from "~/components/monorepo-packages-component";
import { NpmrcComponent } from "~/components/npmrc-component";
import { PackageJsonComponent } from "~/components/package-json-component";
import { PrettierComponent } from "~/components/prettier-component";
import { ReactComponent } from "~/components/react-component";
import { ShellcheckAllComponent } from "~/components/shellcheck-all-component";
import { TypescriptComponent } from "~/components/typescript-component";
import type { PackageContext } from "~/context/package-context";

export function findMatchingComponents(ctx: PackageContext) {
    const components: Component[] = [
        // base
        new PackageJsonComponent(),
        new TypescriptComponent(),
        new EslintComponent(),
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
        new EsbuildComponent(),
        new ReactComponent(),
        new ChakraUiComponent(),

        // lint fix
        new LintFixComponent(),
    ];

    return components.filter((c) => c.matches(ctx));
}
