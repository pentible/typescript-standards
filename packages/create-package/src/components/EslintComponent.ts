import Component from "./Component";
import type PackageContext from "~/src/context/PackageContext";
import { execaCommand } from "execa";
import { writeFile } from "fs/promises";
import { stringify } from "yaml";
import PackageType from "~/src/context/PackageType";
import merge from "deepmerge";

// TODO: consider a stricter type
type Eslintrc = Record<
    string,
    boolean | string | Record<string, boolean | string>
>;

export default class EslintComponent extends Component {
    matches() {
        return true;
    }
    async apply({ type, insideMonorepo }: PackageContext) {
        const partials: Eslintrc[] = [];

        if (!insideMonorepo) {
            partials.push({
                root: true,
                extends: "@pentible/eslint-config",
            });
        }

        // TODO: hmm web vs react... could be based on react feature, but that may be messy
        // extends: "@pentible/eslint-config/react",

        // TODO: likely most types will have different env's, should structure to make it harder to forget to add here?
        if (type === PackageType.Web) {
            partials.push({
                env: {
                    browser: true,
                },
            });
        }

        if (type === PackageType.WebExtension) {
            partials.push({
                env: {
                    browser: true,
                    webextensions: true,
                },
            });
        }

        if (type === PackageType.Node) {
            partials.push({
                env: {
                    node: true,
                },
            });
        }

        // install in root
        if (!insideMonorepo) {
            await execaCommand(
                "npm install -D eslint@8 @pentible/eslint-config",
            );
        }

        if (partials.length > 0) {
            const eslintrc = merge.all(partials);
            const yaml = stringify(eslintrc);

            await writeFile(".eslintrc.yml", yaml);
        }
    }
}
