import { writeFile } from "fs/promises";
import { stringify } from "ini";
import Component from "./Component";
import type PackageContext from "~/src/context/PackageContext";

export default class EditorConfigComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    async apply() {
        const editorConfig = {
            root: true,
            "*": {
                [`indent_style`]: "space",
                [`indent_size`]: 4,
                [`end_of_line`]: "lf",
                [`charset`]: "utf-8",
                [`insert_final_newline`]: true,
                [`trim_trailing_whitespace`]: true,
                // NOTE: editorconfig doesn't exactly use a standard ini parser,
                // so we include this as a sub-section to get the output we want
                // https://github.com/editorconfig/editorconfig-core-js/blob/00502bad0a39b0b22f3009b5bfb4f3b734562d0b/src/lib/ini.ts
                "{yaml,yml}": {
                    [`indent_size`]: 2,
                },
            },
        };

        const ini = stringify(editorConfig, {
            whitespace: true,
        });

        await writeFile(".editorconfig", ini);
    }
}
