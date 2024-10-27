import { BrowserslistComponent } from "#src/components/browserslist-component";
import { ChakraUiComponent } from "#src/components/chakra-ui-component";
import { CheckPackageLockComponent } from "#src/components/check-package-lock-component";
import type { Component } from "#src/components/component";
import { EditorConfigComponent } from "#src/components/editor-config-component";
import { EsbuildComponent } from "#src/components/esbuild-component";
import { EslintComponent } from "#src/components/eslint-component";
import { HuskyComponent } from "#src/components/husky-component";
import { IgnoreFileComponent } from "#src/components/ignore-file-component";
import { LintFixComponent } from "#src/components/lint-fix-component";
import { LintStagedComponent } from "#src/components/lint-staged-component";
import { MonorepoPackagesComponent } from "#src/components/monorepo-packages-component";
import { NpmrcComponent } from "#src/components/npmrc-component";
import { PackageJsonComponent } from "#src/components/package-json-component";
import { PrettierComponent } from "#src/components/prettier-component";
import { ReactComponent } from "#src/components/react-component";
import { ShellcheckAllComponent } from "#src/components/shellcheck-all-component";
import { TypescriptComponent } from "#src/components/typescript-component";
import type { PackageContext } from "#src/context/package-context";

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
