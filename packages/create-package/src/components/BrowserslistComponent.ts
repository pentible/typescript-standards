import { writeFile } from "fs/promises";
import type { Formatter } from "../formatting/Formatter";
import { Component } from "./Component";
import type { PackageContext } from "src/context/PackageContext";
import { PackageType } from "src/context/PackageType";
import { base64UrlEncode } from "src/utility/base64UrlEncode";

export class BrowserslistComponent extends Component {
    matches() {
        return true;
    }
    browsers(type: PackageType) {
        switch (type) {
            case PackageType.Web:
                return ["defaults", "not IE 11", "not op_mini all"];
            case PackageType.Node:
            case PackageType.Config:
                return ["maintained node versions"];
            case PackageType.Library:
            case PackageType.Monorepo:
            case PackageType.Electron: // TODO: not actually sure what's most appropriate for electron...
                return [
                    "defaults",
                    "not IE 11",
                    "not op_mini all",
                    "maintained node versions",
                ];
            case PackageType.WebExtension:
                return ["last 2 chrome version", "last 2 firefox version"];
        }
    }
    browserslistUrl(browsers: string[]) {
        const browsersQuery = base64UrlEncode(browsers.join(", "));
        return `https://browserslist.dev/?q=${browsersQuery}`;
    }
    async apply({ type }: PackageContext, formatter: Formatter) {
        const browsers = this.browsers(type);
        const browserslistUrl = this.browserslistUrl(browsers);

        const browserslistrc = [`# ${browserslistUrl}`, ...browsers];

        await writeFile(".browserslistrc", formatter.lines(browserslistrc));
    }
}
