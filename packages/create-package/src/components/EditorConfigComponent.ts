import { writeFile } from "fs/promises";
import { stringify } from "ini";
import Component from "./Component";
import type PackageContext from "~/src/context/PackageContext";

const indentStyle = "indent_style";
const indentSize = "indent_size";
const endOfLine = "end_of_line";
const insertFinalNewline = "insert_final_newline";
const trimTrailingWhitespace = "trim_trailing_whitespace";

export default class EditorConfigComponent extends Component {
    matches({ insideMonorepo }: PackageContext) {
        // only root packages
        return !insideMonorepo;
    }
    async apply() {
        const editorConfig = {
            root: true,
            "*": {
                [indentStyle]: "space",
                [indentSize]: 4,
                [endOfLine]: "lf",
                charset: "utf-8",
                [insertFinalNewline]: true,
                [trimTrailingWhitespace]: true,
                // NOTE: editorconfig doesn't exactly use a standard ini parser,
                // so we include this as a sub-section to get the output we want
                // https://github.com/editorconfig/editorconfig-core-js/blob/00502bad0a39b0b22f3009b5bfb4f3b734562d0b/src/lib/ini.ts
                "{yaml,yml}": {
                    [indentSize]: 2,
                },
            },
        };

        const ini = stringify(editorConfig, {
            whitespace: true,
        });

        await writeFile(".editorconfig", ini);
    }
}
